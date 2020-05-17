/**
 * Une localisation
 */
const Area = require('./Area');
const o876 = require('../o876/index');
const Vector = o876.geometry.Vector;

module.exports = class Location {
	constructor(x = 0, y = 0, angle = 0, area = null) {
		this._heading = angle;
		this._area = area;
		this._position = new Vector(x, y);
	}

	assign(other) {
		this
			.position(new Vector(other.position()))
			.heading(other.heading())
			.area(other.area());
	}

	position(p) {
		return o876.SpellBook.prop(this, '_position', p);
	}

	area(a) {
		if (a) {
			if (typeof a !== 'object' || a.constructor.name !== 'Area') {
				throw new Error('location.area must be an instance of Area. Instance of : "' + a.constructor.name + '" given');
			}
		}
        return o876.SpellBook.prop(this, '_area', a, 'o');
	}

    /**
	 * Défini un nouvel angle
     * @param a {number}
     */
	heading(a) {
		return o876.SpellBook.prop(this, '_heading', a);
	}
};