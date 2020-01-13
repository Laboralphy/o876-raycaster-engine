import Position from "./Position";
import Vector from "../geometry/Vector";


let LAST_ID = 0;

/**
 * Entities are things that move or stay static in the level.
 * Each entity has a position and a thinker
 * They can be :
 * - Player or Non Player Character
 * - Static Decorations (plants, lamps...)
 * - The Main Camera
 */

class Entity {
    constructor() {
        this._id = ++LAST_ID;
        this._position = new Position();
        this._visible = false;
        this._sprite = null;
        this._thinker = null;
        this._size = 0;
        this._inertia = new Vector();
        this._dead = false;
        this._lightsource = null;
        this._sector = null; // this is a logical sector, for tag and door management purpose (not collision)
        this.data = {}; // user data
    }


    get sector() {
        return this._sector;
    }

    get lightsource() {
        return this._lightsource;
    }

    set lightsource(value) {
        this._lightsource = value;
    }

    get id() {
        return this._id;
    }

    think(engine) {
        const thinker = this._thinker;
        thinker.think(this, engine);
    }

    get size() {
        return this._size;
    }

    set size(value) {
        this._size = value;
    }

    get visible() {
        return this._visible;
    }

    set visible(value) {
        this._visible = value;
    }

    get thinker() {
        return this._thinker;
    }

    set thinker(value) {
        value.entity = this;
        this._thinker = value;
    }

    set sprite(value) {
        this._sprite = value;
    }

    get sprite() {
        return this._sprite;
    }

    get position() {
        return this._position;
    }

    set position(value) {
        this._position.set(value);
    }

    get inertia() {
        return this._inertia;
    }

    set inertia(value) {
        this._inertia = value;
    }

    get dead() {
        return this._dead;
    }

    set dead(value) {
        this._dead = value;
    }
}

export default Entity;