import Location from "./Location";
import Vector from "../geometry/Vector";
import Dummy from "../collider/Dummy";
import {computeWallCollisions} from "../wall-collider";

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
        this._location = new Location();
        this._visible = false;
        this._sprite = null;
        this._thinker = null;
        this._size = 0;
        this._inertia = new Vector();
        this.data = {};
    }

    think(engine) {
        const thinker = this._thinker;
        if (thinker) {
            thinker.think(this, engine);
        }
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

    get location() {
        return this._location;
    }

    set location(value) {
        this._location.set(value);
    }

    get inertia() {
        return this._inertia;
    }

    set inertia(value) {
        this._inertia = value;
    }
}

export default Entity;