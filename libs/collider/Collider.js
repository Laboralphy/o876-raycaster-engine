/**
 * @class Collider
 * The collider computes collision between sprites.
 * Sprites are positionned inside the collider grid, according to their position
 * Each sprites is tested against all other sprite in the surroundiing cells.
 */

import Vector from '../geometry/Vector';
import Geometry from "../geometry";
import SectorRegistry from "../sector-registry/SectorRegistry";

class Collider extends SectorRegistry {
	constructor() {
		super();
        this._origin = new Vector(); // vector origine du layer
	}

	/**
	 * Registers an object in the sector it belongs
	 * Unregisters the object in all other sector
	 * @param oDummy {Dummy}
	 */
	updateDummy(oDummy) {
		let oOldSector = oDummy.colliderSector;
		let v = oDummy.position.sub(this._origin);
		let s = oDummy.dead ? null : this.sector(v);
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
	 * Computes a force vector to apply to a dummy if it collides with other
	 * @param oDummy {Dummy} subject to compute force from
	 * @return {Vector} force vector to apply to Dummy
	 */
	getCollidingForce(oDummy) {
		// compute a new set of forces to be applied to the dummy
		const aHitters = this.getCollidingDummies(oDummy);
		if (aHitters.length > 0) {
			this.computeCollidingForces(oDummy, aHitters);
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
	getCollidingDummies(oDummy) {
		let a = [];
		oDummy.lastCollidingDummies = a;
		let oSector = this.sector(oDummy.position.sub(this._origin));
		if (!oSector) {
			return a;
		}
		let x = oSector.x;
		let y = oSector.y;
		let xMin = Math.max(0, x - 1);
		let yMin = Math.max(0, y - 1);
		let xMax = Math.min(this._grid.getWidth() - 1, x + 1);
		let yMax = Math.min(this._grid.getHeight() - 1, y + 1);
		let ix, iy;
		for (iy = yMin; iy <= yMax; ++iy) {
			for (ix = xMin; ix <= xMax; ++ix) {
				a.push(...this
					.sector(ix, iy)
					.objects
					.filter(oTest => Collider._entitiesAreHitting(oDummy, oTest))
				);
			}
		}
		return a;
	}

	/**
	 * renvoie true si o1 et o2 se heurte (avec o1 != o2)
	 * @param o1 {*} premier objet
	 * @param o2 {*} second objet
	 * @return {boolean}
	 * @private
	 * @static
	 */
	static _entitiesAreHitting(o1, o2) {
		if (o1 === o2) {
			return false;
		} else {
			return o1.hits(o2);
		}
	}

    /**
	 * For each specified hitter, adds a force that is proportional to the distance between the hitter and the dummy subject
     * @param oDummy {Dummy} the subject whose forces will be applied to
     * @param aHitters {Dummy[]} a collection of dummy reputed to overlap the dummy subject
     * @returns {Vector[]} a collection of resulting forces.
     */
    computeCollidingForces(oDummy, aHitters) {
        let vPos = oDummy.position;
        let x = vPos.x;
        let y = vPos.y;
        let dist = Geometry.distance;
        return aHitters.map(m => {
            let mPos = m.position;
            let mx = mPos.x;
            let my = mPos.y;
			return oDummy.forceField.addForce(
			    vPos.sub(mPos)
			        .normalize()
					.scale((oDummy._radius + m._radius - dist(x, y, mx, my)) / 2),
			    0
			);
        });
    }
}

export default Collider;