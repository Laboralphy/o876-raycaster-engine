/**
 * @class Collider
 * The collider computes collision between sprites.
 * Sprites are positionned inside the collider grid, according to their position
 * Each sprites is tested against all other sprite in the surroundiing cells.
 */

import Vector from '../geometry/Vector';
import Grid from '../grid/Grid';
import Sector from './Sector';
import GeometryHelper from "../geometry/GeometryHelper";

class Collider {
	constructor() {
        this._origin = new Vector(); // vector origine du layer
        this._grid = new Grid();
        this._grid.on('rebuild', function(data) {
            let oSector = new Sector();
            oSector.x = data.x;
            oSector.y = data.y;
            data.cell = oSector;
        });
        this._cellWidth = 0;
        this._cellHeight = 0;
	}

    setCellWidth(w) {
        this._cellWidth = w;
        return this;
    }

    setCellHeight(h) {
        this._cellHeight = h;
        return this;
    }

    getCellWidth() {
        return this._cellWidth;
    }

    getCellHeight() {
        return this._cellHeight;
    }

    get grid() {
		return this._grid;
	}

	/**
	 * Return the sector corresponding to the given coordinates
     * if the parameters are number, the real sector indices are used (0, 1, 2...)
	 * if the parameter is a Vector, its components are int-divided by cell size before application
	 * @param x {number} position x
	 * @param y {number|undefined} position y
	 * @return {*}
	 */
	sector(x, y) {
		if (y === undefined) {
			return this._grid.cell(x.x / this._cellWidth | 0, x.y / this._cellHeight | 0);
		} else {
			return this._grid.cell(x, y);
		}
	}

	/**
	 * Registers an object in the sector it belongs
	 * Unregisters the objet in all other sector
	 * @param oDummy {Dummy}
	 */
	track(oDummy) {
		let oOldSector = oDummy.colliderSector;
		let v = oDummy.position.sub(this._origin);
		let s = oDummy.dead ? null : this.sector(v);
		if (s && oOldSector && s === oOldSector) {
			return;
		}
		if (oOldSector) {
			oOldSector.remove(oDummy);
		}
		if (s) {
			s.add(oDummy);
		}
		oDummy.colliderSector = s;
		return this;
	}

	/**
	 * Effectue tous les test de collision entre un objet et tous les autres objets
	 * contenus dans les secteur adjacent a celui de l'objet
	 * @param oDummy {Dummy}
	 * @return {Dummy[]} liste d'objet collisionnant
	 */
	getCollidingDummies(oDummy) {
		let a = [];
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
				a = a.concat(this.sector(ix, iy).collides(oDummy));
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
    computeCollidingForces(oDummy, aHitters) {
        let vPos = oDummy.position;
        let x = vPos.x;
        let y = vPos.y;
        let dist = GeometryHelper.distance;
        return aHitters.map(m => {
            let mPos = m.position;
            let mx = mPos.x;
            let my = mPos.y;
            return oDummy.forceField.addForce(
                vPos.sub(mPos)
                    .normalize()
                    .scale((m._radius + m._radius - dist(x, y, mx, my)) / 2),
                0
            )
        });
    }

    /**
	 * computes a a collection of forces applied to a dummy subject, returns true if one or more hitter is detected
     * @param oDummy {Dummy}
     * @returns {boolean}
     */
    computeDummyCollisions(oDummy) {
		// 1 - for each colliding dummies
		const aHitters = this.getCollidingDummies(oDummy);
		this.computeCollidingForces(oDummy, aHitters);
		return !!aHitters;
	}

}

export default Collider;