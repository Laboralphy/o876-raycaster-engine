/**
 * uses collider and forcefield to manage forces that affecting a bunch of moving entities
 */
import Collider from "../collider/Collider";
import Dummy from "../collider/Dummy";

class Newton {
    constructor() {
        this._collider = new Collider();
        this._horde = [];
    }

    linkEntity(entity) {
        const dummy = new Dummy();
        entity.data.dummy()
        this._horde.push(h);
        return h;
    }

    unlinkEntity(entity) {

    }
}