import SectorRegistry from "../sector-registry/SectorRegistry";
import Geometry from "../geometry";
import Vector from "../geometry/Vector";
import Events from "events";
import Dummy from "./Dummy";

/**
 * @typedef SmashingEntity
 * @property dummy {Dummy}
 */


/**
 *
 */
class Smasher extends SectorRegistry {

    constructor() {
        super();
        this._origin = new Vector(); // vector origine du layer
        this._events = new Events();
        this._entities = [];
    }

    get events() {
        return this._events;
    }

    /**
     * checks if entity has "dummy" property and is an instance of Dummy
     * @param oEntity {SmashingEntity}
     */
    validateEntity(oEntity) {
        if (!(('dummy' in oEntity) && (oEntity.dummy instanceof Dummy))) {
            throw new Error('entity must have "dummy" property, and this property must be instance of Dummy class');
        }
    }

    /**
     *
     * @param oEntity {SmashingEntity}
     */
    registerEntity(oEntity) {
        // checks if entity has "dummy"
        this.validateEntity(oEntity);
        this._entities.push(oEntity);
    }

    /**
     *
     * @param oEntity {SmashingEntity}
     */
    unregisterDummy(oEntity) {
        this.validateEntity(oEntity);
        const d = this._entities;
        const dummy = oEntity.dummy;
        dummy.dead = true;
        this.updateEntity(oEntity);
        const i = d.indexOf(oEntity);
        if (i >= 0) {
            d.splice(i, 1);
        }
    }

    process() {
        const aEntities = this._entities;
        aEntities.forEach(entity => {
            this.events.emit('entity.dummy.update', {entity});
            this.updateEntity(entity);
        });
        aEntities.forEach(entity => {
            this.processEntity(entity);
        });
    }

    /**
     * Registers an object in the sector it belongs
     * Unregisters the object in all other sector
     * @param oEntity {SmashingEntity}
     */
    updateEntity(oEntity) {
        let dummy = oEntity.dummy;
        let oOldSector = dummy.colliderSector;
        let v = dummy.position.sub(this._origin);
        let s = dummy.dead ? null : this.sectorFromVector(v);
        if (!dummy.dead && s === null) {
            throw new Error('sector ' + (v.x / this._cellWidth | 0).toString() + ' ' + (v.y / this._cellHeight | 0).toString() + ' does not exists.');
        }
        let bSameSector = s && oOldSector && s === oOldSector;
        if (!bSameSector) {

            // it seems that dummy changed sector
            if (oOldSector) {
                oOldSector.remove(oEntity);
            }
            if (s) {
                s.add(oEntity);
            }
            dummy.colliderSector = s;
        }
    }

    /**
     * renvoie true si o1 et o2 se heurte (avec o1 != o2)
     * @param o1 {Dummy} premier objet
     * @param o2 {Dummy} second objet
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
     * @param oEntity {SmashingEntity} subject to compute force from
     * @return {Vector} force vector to apply to Dummy
     */
    processEntity(oEntity) {
        const oDummy = oEntity.dummy;
        if (!oDummy) console.log(oEntity)
        // compute a new set of forces to be applied to the dummy
        const aHitters = this._getSmashingEntities(oEntity);
        if (!!aHitters && aHitters.length > 0) {
            this.events.emit('entity.smashed', {entity: oEntity, smashers: aHitters})
            this._computeSmashingForces(oEntity, aHitters);
            oDummy.setSmashers(aHitters)
        } else {
            oDummy.clearSmashers(aHitters)
        }
        const forceField = oDummy.forceField;
        const f = forceField.computeForces();
        oDummy.force.set(f);
        forceField.reduceForces();
    }

    /**
     * Effectue tous les test de collision entre un objet et tous les autres objets
     * contenus dans les secteur adjacent a celui de l'objet
     * @param oEntity {SmashingEntity}
     * @return {SmashingEntity[]} liste d'objet collisionnant
     */
    _getSmashingEntities(oEntity) {
        const oDummy = oEntity.dummy;
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
                    .filter(oTest => Smasher._dummiesAreHitting(oDummy, oTest.dummy));

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
     * @param oEntity {SmashingEntity} the subject whose forces will be applied to
     * @param aHitters {SmashingEntity[]} a collection of dummy reputed to overlap the dummy subject
     * @returns {Vector[]} a collection of resulting forces.
     */
    _computeSmashingForces(oEntity, aHitters) {
        const oDummy = oEntity.dummy;
        let vPos = oDummy.position;
        let x = vPos.x;
        let y = vPos.y;
        let dist = Geometry.distance;
        return aHitters.map(m => {
            const oHitDummy = m.dummy;
            let mPos = oHitDummy.position;
            let mx = mPos.x;
            let my = mPos.y;
            const d = dist(x, y, mx, my);
            return oDummy.forceField.addForce(
                vPos.sub(mPos)
                    .normalize()
                    .scale( Math.max(0, (oDummy.radius + oHitDummy.radius - d) / 2)),
                0
            );
        });
    }
}

export default Smasher;
