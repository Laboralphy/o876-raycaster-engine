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
        this.state = 'standing'
    }

    syncDummy() {
        // synchronizing dummy position
        const engine = this.engine;
        const entity = this.entity;
        const dummy = this._dummy;
        const location = entity.location;
        const collider = engine._collider;
        dummy.radius = entity.size;
        dummy.position.set(location.x, location.y);
        collider.updateDummy(dummy);
    }

    $standing() {
        this.syncDummy();
    }
}

export default StaticTangibleThinker;