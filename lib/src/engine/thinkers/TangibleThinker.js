import Dummy from "../../collider/Dummy";
import MoverThinker from "./MoverThinker";


/**
 * this thinker is suitable for moving entities that can interact with other tangible entities
 * the collider and force field instances allows this thinker to properly react after any collision
 */
class TangibleThinker extends MoverThinker {
    constructor() {
        super();
        this._dummy = new Dummy();
    }

    get dummy() {
        return this._dummy;
    }

    syncDummy() {
        // synchronizing dummy position
        const engine = this.engine;
        const entity = this.entity;
        const dummy = this.dummy;
        const position = entity.position;
        const collider = engine._collider;
        dummy.radius = entity.size;
        dummy.position.set(position.x, position.y);
        collider.updateDummy(dummy);
        const f = collider.getCollidingForce(dummy);
        this.slide(f);
        dummy.position.set(position.x, position.y);
    }

    processForces() {
        // synchronizing dummy position
        this.syncDummy();
    }





    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    s_move() {
        super.s_move();
        this.processForces();
    }
}

export default TangibleThinker;