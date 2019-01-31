import {computeWallCollisions} from "../../wall-collider";
import Thinker from "./Thinker";
import Vector from "../../geometry/Vector";

/**
 * a base thinker for moving entities.
 * moving and tangible entities should use this thinker
 */
class MoverThinker extends Thinker {
    constructor() {
        super();
        this._speed = new Vector(); // real speed vector that controls the entity movement
        this._bHasChangedMovement = true;
        this._bCrashWall = false;
        this._cwc = null;
        this.state = 'move';
    }

    /**
     * thinker main method
     */
    $move() {
        let m = this.entity;
        m.inertia.set(0, 0);
        this.slide(this._speed);
    }


    /**
     * returns true if the entity has changed its movement
     * i.e. its speed vector has changed, or its angle has changed
     */
    hasChangedMovement() {
        let b = this._bHasChangedMovement;
        this._bHasChangedMovement = false;
        return b;
    }

    /**
     * the entity movement has changed
     */
    changeMovement() {
        this._bHasChangedMovement = true;
    }

    slide(v) {
        const entity = this.entity;
        const engine = this.engine;
        const location = entity.location;
        const rc = engine.raycaster;
        const ps = rc.options.metrics.spacing;
        const size = entity.size;

        const cwc = this._cwc = computeWallCollisions(
            location.x,
            location.y,
            v.x,
            v.y,
            size,
            ps,
            this._bCrashWall,
            (x0, y0) => rc.getCellPhys(x0 / ps | 0, y0 / ps | 0) !== 0
        );
        entity.location.x += cwc.speed.x;
        entity.location.y += cwc.speed.y;
        entity._inertia.x = cwc.speed.x;
        entity._inertia.y = cwc.speed.y;
    }

    getMovement() {
        let m = this.entity;
        let loc = m.location;
        let spd = m.inertia;
        return {
            a: loc.angle,
            x: loc.x,
            y: loc.y,
            sx: spd.x,
            sy: spd.y,
        };
    }

    setSpeed(sx, sy) {
        if (sx instanceof Vector) {
            this.changeMovement();
            this._speed.set(sx);
        } else if (sx !== this._speed.x || sy !== this._speed.y) {
            this.changeMovement();
            this._speed.set(sx, sy);
        }
    }

}

export default MoverThinker;