/**
 * Permet de gerer un ensemble de force appliquée à un mobile
 */

const Vector = require('../../geometry/Vector');

class ForceField {
    constructor() {
        this._forces = [];
    }

    /**
     * ajoute une force
     * @param v {Vector} vecteur de force
     * @param f {number} facteur d'atténuation
     */
    force(v, f) {
        let fNew = {v, f};
        this._forces.push(fNew);
        return fNew;
    }

	/**
	 * retoourne les forces agissant sur le système
	 * @return Vector
	 */
	forces() {
        return this._forces;
	}

	/**
	 * Somme de toutes les forces agissant sur le système
	 * @return Vector
	 */
	computeForces() {
	    return this._forces.reduce((prev, f) => prev.add(f.v), Vector.zero());
	}

    /**
     * Réduit l'effet des forces appliquées au mobile
     */
    reduceForces() {
        this._forces = this._forces.filter(f => f.v.scale(f.f).length() < 0.01);
    }
}

module.exports = ForceField;