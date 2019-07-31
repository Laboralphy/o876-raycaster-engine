//import Dummy from "../../collider/Dummy";
import Thinker from "./Thinker";


/**
 * this thinker is suitable for moving entities that do not interact with other tangible entities
 */
class StaticThinker extends Thinker {
    constructor() {
        super();
        //this._dummy = new Dummy();
        this.state = 'standing'
    }

    syncDummy() {
        // synchronizing dummy position
        //const entity = this.entity;
        //const dummy = this._dummy;
        //const location = entity.location;
        //const collider = engine._collider;
        //dummy.radius = entity.size;
        //dummy.position.set(location.x, location.y);
        //collider.track(dummy);
    }

    $standing() {
        //this.syncDummy();
    }
}

export default StaticThinker;