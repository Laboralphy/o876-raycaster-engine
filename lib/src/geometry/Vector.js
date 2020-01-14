/**
 * Created by ralphy on 04/09/17.
 *
 * @class Vector
 * @property {number} x
 * @property {number} y
 */

import GeometryHelper from './GeometryHelper';

class Vector {
	/**
	 * The constructor accepts one two parameters
	 * If one parameter is given, the constructor will consider it as
	 * Vector and will build this vector accordingly.
	 * If two parameters are given (both numbers), the constructor will initialize the x and y
	 * components with these numbers.
	 * if no parameters are given : the vector will be ZERO
	 * @param (x) {Vector|number}
	 * @param (y) {number}
	 */
	constructor(x, y) {
		if (x instanceof Vector) {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x || 0;
			this.y = y || 0;
		}
	}

    /**
	 * Mutable !
	 * Modifie x et y
     * @param x
     * @param y
     */
	set(x, y) {
		if (x instanceof Vector) {
			return this.set(x.x, x.y);
		}
		this.x = x;
		this.y = y;
		return this;
	}

	/**
	 * Immutable !
	 * returns a new Vector which is the sum of this instance + the given argument
	 * @param v {Vector}
	 * @returns {Vector}
	 */
	add(v) {
		return new Vector(v.x + this.x, v.y + this.y);
	}

	/**
	 * Immutable !
	 * returns a new Vector which is the diffrence of this instance and the given argument
	 * @param v
	 */
	sub(v) {
		return new Vector(this.x - v.x, this.y - v.y);
	}

	neg() {
		return new Vector(-this.x, -this.y);
	}

	/**
	 * Immutable !
	 * returns a scalar product
	 * multiplies the vector components by a given value -(vector or number)
	 * @param f {Vector|number}
	 * @returns {Vector|number}
	 */
	mul(f) {
		if (f instanceof Vector) {
			return this.x * f.x + this.y * f.y;
		} else if (typeof f === 'number') {
			return new Vector(this.x * f, this.y * f);
		} else {
			throw new Error('vector product accepts only vectors or number as parameter');
		}
	}

	/**
	 * return the vector length
	 * @return {number}
	 */
	length() {
		return GeometryHelper.distance(0, 0, this.x, this.y);
	}

	/**
	 * returns a normalized version of this vector
	 * @return {Vector}
	 */
	normalize() {
		return this.mul(1 / this.length());
	}

	/**
	 * returns a zero vector
	 * @returns {Vector}
	 */
	static zero() {
		return new Vector(0, 0);
	}

    /**
	 * Mutable
	 * Addition mutable des composante du vecteur
     * @param v {Vector}
     */
	translate(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

    /**
     * Mutable
     * Multiplication mutable des composante du vecteur
     * @param f {number}
     */
	scale(f) {
		this.x *= f;
		this.y *= f;
		return this;
	}

    /**
	 * Renvoie l'angle entre le vecteur et l'axe X
	 * si le vecteur est dans la direction x+ alors l'angle = 0
     */
	angle() {
		return GeometryHelper.angle(0, 0, this.x, this.y);
	}

	toString() {
		return [this.x, this.y].map(n => n.toString()).join(':');
	}

	fromPolar(a, s) {
		let v = GeometryHelper.polar2rect(a, s);
		this.set(v.dx, v.dy);
		return this;
	}
}

export default Vector;