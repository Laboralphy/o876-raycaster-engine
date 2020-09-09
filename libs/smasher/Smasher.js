import SectorRegistry from "libs/sector-registry/SectorRegistry";
import Geometry from "libs/geometry";
import Vector from "libs/geometry/Vector";
import Events from "events";

class Smasher extends SectorRegistry {

    constructor() {
        super();
        this._origin = new Vector(); // vector origine du layer
        this._events = new Events();
        this._dummies = [];
    }

    registerDummy(dummy) {
        this._dummies.push(dummy);
    }

    unregisterDummy(dummy) {
        const d = this._dummies;
        dummy.dead = true;
        this.updateDummy(dummy);
        const i = d.indexOf(dummy);
        if (i >= 0) {
            d.splice(i, 1);
        }
    }

    process() {
        const dummies = this._dummies;
        dummies.forEach(dummy => {
            this.updateDummy(dummy);
        });
        dummies.forEach(dummy => {
            const force = this.getSmashingForce(dummy);
            if (force.x !== 0 || force.y !== 0) {
                this._events.emit('updateforces', {dummy, force});
            }
        });
    }

    /**
     * Registers an object in the sector it belongs
     * Unregisters the object in all other sector
     * @param oDummy {Dummy}
     */
    updateDummy(oDummy) {
        let oOldSector = oDummy.colliderSector;
        let v = oDummy.position.sub(this._origin);
        let s = oDummy.dead ? null : this.sectorFromVector(v);
        if (!oDummy.dead && s === null) {
            throw new Error('sector ' + (v.x / this._cellWidth | 0).toString() + ' ' + (v.y / this._cellHeight | 0).toString() + ' does not exists.');
        }
        let bSameSector = s && oOldSector && s === oOldSector;
        if (!bSameSector) {

            // it seems that dummy changed sector
            if (oOldSector) {
                oOldSector.remove(oDummy);
            }
            if (s) {
                s.add(oDummy);
            }
            oDummy.colliderSector = s;
        }
    }

    /**
     * renvoie true si o1 et o2 se heurte (avec o1 != o2)
     * @param o1 {*} premier objet
     * @param o2 {*} second objet
     * @return {boolean}
     * @private
     * @static
     */
    static _dummiesAreHitting(o1, o2) {
        if (o1 === o2) {
            return false;
        } else {
            return o1.hits(o2);
        }
    }

    /**
     * Computes a force vector to apply to a dummy if it collides with other
     * @param oDummy {Dummy} subject to compute force from
     * @return {Vector} force vector to apply to Dummy
     */
    getSmashingForce(oDummy) {
        // compute a new set of forces to be applied to the dummy
        const aHitters = this._getSmashingDummies(oDummy);
        if (!!aHitters && aHitters.length > 0) {
            this._computeSmashingForces(oDummy, aHitters);
        }
        const forceField = oDummy.forceField;
        const f = forceField.computeForces();
        forceField.reduceForces();
        return f;
    }

    /**
     * Effectue tous les test de collision entre un objet et tous les autres objets
     * contenus dans les secteur adjacent a celui de l'objet
     * @param oDummy {Dummy}
     * @return {Dummy[]} liste d'objet collisionnant
     */
    _getSmashingDummies(oDummy) {
        if (oDummy.tangibility.self === 0) {
            return null;
        }
        let oSector = this.sectorFromVector(oDummy.position.sub(this._origin));
        if (!oSector) {
            return null;
        }
        let a = null;
        let x = oSector.x;
        let y = oSector.y;
        let xMin = Math.max(0, x - 1);
        let yMin = Math.max(0, y - 1);
        let xMax = Math.min(this._grid.width - 1, x + 1);
        let yMax = Math.min(this._grid.height - 1, y + 1);
        let ix, iy;
        for (iy = yMin; iy <= yMax; ++iy) {
            for (ix = xMin; ix <= xMax; ++ix) {
                const p = this
                    .sector(ix, iy)
                    .objects
                    .filter(oTest => Smasher._dummiesAreHitting(oDummy, oTest));

                if (p.length > 0) {
                    if (!a) {
                        a = p;
                    } else {
                        a.push(...p);
                    }
                }
            }
        }
        return a;
    }

    /**
     * For each specified hitter, adds a force that is proportional to the distance between the hitter and the dummy subject
     * @param oDummy {Dummy} the subject whose forces will be applied to
     * @param aHitters {Dummy[]} a collection of dummy reputed to overlap the dummy subject
     * @returns {Vector[]} a collection of resulting forces.
     */
    _computeSmashingForces(oDummy, aHitters) {
        let vPos = oDummy.position;
        let x = vPos.x;
        let y = vPos.y;
        let dist = Geometry.distance;
        return aHitters.map(m => {
            let mPos = m.position;
            let mx = mPos.x;
            let my = mPos.y;
            const d = dist(x, y, mx, my);
            const d2 = d / 2;
            return oDummy.forceField.addForce(
                vPos.sub(mPos)
                    .normalize()
                    .scale( Math.max(0, (oDummy.radius + m.radius - d) / 2)),
                0
            );
        });
    }
}

export default Smasher;
