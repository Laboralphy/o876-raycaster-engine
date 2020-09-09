/**
 * @class Mobile
 * This class manages a mobile object.
 */
import Geometry from '../geometry';
import Vector from '../geometry/Vector';
import ForceField from "../force-field/ForceField";


class Dummy {
    constructor() {
        this._entity = 0;
        this._position = new Vector();
        this._dead = false; // les mobile noté "dead" doivent être retiré du jeu
        this._radius = 0;
        this._mass = 1;
        this._tangibility = {
            self: 1,
            hitmask: 1
        };
        this.colliderSector = null;
        this.forceField = new ForceField();
    }

    get mass() {
        return this._mass;
    }

    set mass(value) {
        this._mass = value;
    }

    set entity(value) {
        this._entity = value;
    }

    get entity() {
        return this._entity;
    }

    get tangibility() {
        return this._tangibility;
    }

    get position() {
        return this._position;
    }

    set position(value) {
        this._position.set(value);
    }

    get dead() {
        return this._dead;
    }

    set dead(value) {
        this._dead = value;
    }

    get radius() {
        return this._radius;
    }

    set radius(value) {
        this._radius = value;
    }


    /**
     * Renvoie true si le masque-tangibilité de ce dummy correspond au type-tangibilité du dummy spécifié
     * @param dummy
     */
    tangibleWith(dummy) {
        return (dummy._tangibility.self & this._tangibility.hitmask) !== 0;
    }

    /**
     * Renvoie true si la distance entre le mobile et un autre mobile est inférieur à une valeur donnée
     * @param oOther {Dummy}
     * @param d {number}
     * @returns {*|number}
     */
    nearerThan(oOther, d) {
        let p1 = this.position;
        let p2 = oOther.position;
        return Geometry.squareDistance(p1.x, p1.y, p2.x, p2.y) < (d * d);
    }

    /**
     * Renvoi l'angle entre les deux mobile (this et oOther) et l'axe X
     * @param oOther {Dummy}
     * @returns {number}
     */
    angleTo(oOther) {
        let p1 = this.position;
        let p2 = oOther.position;
        return Geometry.angle(p1.x, p1.y, p2.x, p2.y);
    }

    /**
     * renvoie true si les deux mobile se collisionne.
     * @param oOther {Dummy}
     * @returns {boolean}
     */
    hits(oOther) {
        const a = this.tangibleWith(oOther) && this.nearerThan(oOther, this._radius + oOther.radius);
        return a;
    }
}

export default Dummy;