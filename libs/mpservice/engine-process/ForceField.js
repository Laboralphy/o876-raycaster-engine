/**
 * Permet de gerer un ensemble de force appliquée à un mobile
 */

const o876 = require('../o876');
const Vector = o876.geometry.Vector;

class ForceField {
    constructor() {
        this._forces = [];
    }

    /**
     * ajoute une force
     * @param v {Vector} vecteur de force
     * @param f {number} facteur d'atténuation
     * @param extraData {*} données sup'
     */
    force(v, f, extraData) {
        let fNew = {v, f, ...extraData};
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
        this._forces = this._forces.filter(f => f.v.scale(f.f).normalize() < 0.01);
    }
}

module.exports = ForceField;