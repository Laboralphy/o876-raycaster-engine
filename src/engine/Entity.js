import Location from "./Location";

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
        this.visible = false;
        this._sprite = null;
        this._thinker = null;
    }

    think(engine) {
        const thinker = this._thinker;
        if (thinker) {
            thinker.think(this, engine);
        }
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
}

export default Entity;