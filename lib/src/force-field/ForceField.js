/**
 * Manages a set of forces inside a field.
 * All forces are apply to one entity. It is use when you want to know the resulting force that influences an entity
 * which is affected by many other forces
 * the class is able to
 * - compute the resulting force
 * - reduce all affecting forces
 * - discard weak and unsignificant forces
 */
import Vector from "../geometry/Vector";

class ForceField {
    constructor() {
        this._forces = [];
    }

    /**
     * adds a force in the field collection
     * @param v {Vector} force
     * @param f {number} dim factor. this factor is use when the force is reduced
     * @param extraData {*} extra custom data (identifier etc...) not used in any computation
     * @returns {*} a structure
     */
    addForce(v, f, extraData = {}) {
        let fNew = Object.assign({}, {v, f}, extraData);
        this._forces.push(fNew);
        return fNew;
    }

	/**
	 * this property is the forces collection
	 */
	get forces() {
        return this._forces;
	}

	/**
	 * Adds all forces affecting the entity, and return a resulting force
	 * @return Vector
	 */
	computeForces() {
	    const v = new Vector(0, 0);
	    this._forces.forEach(v2 => {
	        v.translate(v2.v);
        });
	    return v;
	}

    /**
     * Reduces all forces. Forces that are too weak are discarded
     */
    reduceForces() {
        this._forces = this._forces.filter(f => f.v.scale(f.f).length() > 0.01);
    }
}

export default ForceField;