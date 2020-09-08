import Dummy from "../../collider/Dummy";
import MoverThinker from "./MoverThinker";


/**
 * this thinker is suitable for moving entities that can interact with other tangible entities
 * the collider and force field instances allows this thinker to properly react after any collision
 */
class StaticTangibleThinker extends MoverThinker {
    constructor() {
        super();
        this._dummy = new Dummy();
        this.defineTransistions({
            "s_standing": []
        });
        this.automaton.state = "s_standing";
    }

    syncDummy() {
        // synchronizing dummy position
        const engine = this.engine;
        const entity = this.entity;
        const dummy = this._dummy;
        const position = entity.position;
        const collider = engine._collider;
        dummy.radius = entity.size;
        dummy.position.set(position.x, position.y);
        collider.updateDummy(dummy);
    }



    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    s_standing() {
        this.syncDummy();
    }
}

export default StaticTangibleThinker;