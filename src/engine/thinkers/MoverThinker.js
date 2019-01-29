import {computeWallCollisions} from "../../wall-collider";
import Thinker from "./Thinker";

/**
 * a base thinker for moving entities.
 * moving and tangible entities should use this thinker
 */
class MoverThinker extends Thinker {
    constructor() {
        super();
        this._dummy = null;
    }

    slide(v) {
        const entity = this.entity;
        const engine = this.engine;
        const location = entity.location;
        const rc = engine.raycaster;
        const ps = rc.options.metrics.spacing;
        const size = entity.size;

        const cwc = computeWallCollisions(
            location.x,
            location.y,
            v.x,
            v.y,
            size,
            ps,
            false,
            (x0, y0) => rc.getCellPhys(x0 / ps | 0, y0 / ps | 0) !== 0
        );
        entity.location.x += cwc.speed.x;
        entity.location.y += cwc.speed.y;
        entity._inertia.x = cwc.speed.x;
        entity._inertia.y = cwc.speed.y;
    }


    syncDummyLocation() {
        const {x, y} = this.entity.location;
        this._dummy.position.set(x, y);
    }
}

export default Thinker;