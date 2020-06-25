/**
 * Une localisation
 */
const Area = require('./Area');
const Vector = require('../../geometry/Vector');

module.exports = class Location {
	constructor(x = 0, y = 0, angle = 0, area = null) {
		this._heading = angle;
		this._area = area;
		this._position = new Vector(x, y);
	}

	assign(other) {
		this.position = new Vector(other.position);
		this.heading = other.heading;
		this.area = other.area;
	}

	set position(value) {
		this._position.set(value);
	}

	get position() {
		return this._position;
	}

	get area() {
		return this._area;
	}

	set area(value) {
		if (typeof value !== 'object' || value.constructor.name !== 'Area') {
			throw new Error('location.area must be an instance of Area. Instance of : "' + a.constructor.name + '" given');
		}
		this._area = value;
	}

	get heading() {
		return this._heading;
	}

	set heading(value) {
		return this._heading = value;
	}
};