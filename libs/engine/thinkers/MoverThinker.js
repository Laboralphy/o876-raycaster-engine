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
        this._bNewSector = false;
        this._bCrashWall = false;
        this._cwc = null;
        this._xSector = -1;
        this._ySector = -1;
        this.transitions = {
            "s_move": []
        };
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

    /**
     * smooth movement from current position to a new position
     * @param v
     */
    slide(v) {
        if (v.x === 0 && v.y === 0) {
            return;
        }
        const entity = this.entity;
        const engine = this.engine;
        const position = entity.position;
        const rc = engine.raycaster;
        const ps = rc.options.metrics.spacing;
        const size = entity.size;

        const cwc = this._cwc = computeWallCollisions(
            position.x,
            position.y,
            v.x,
            v.y,
            size,
            ps,
            this._bCrashWall,
            (x0, y0) => rc.getCellPhys(x0 / ps | 0, y0 / ps | 0) !== 0
        );
        position.x += cwc.speed.x;
        position.y += cwc.speed.y;
        entity._inertia.x = cwc.speed.x;
        entity._inertia.y = cwc.speed.y;
    }

    /**
     * Jump to another position without translation (disappear, then reappear)
     * no collision is computed
     * @param x {number}
     * @param y {number}
     * @param angle {number}
     */
    setLocation(x, y, angle = null) {
        const entity = this.entity;
        const position = entity.position;
        const engine = this.engine;
        const rc = engine.raycaster;
        const ps = rc.options.metrics.spacing;
        const xSector1 = this._xSector;
        const ySector1 = this._ySector;
        const xSector2 = x / ps | 0;
        const ySector2 = y / ps | 0;
        position.x = x;
        position.y = y;
        if (angle !== null) {
            position.angle = angle;
        }
        if (xSector1 !== xSector2 || ySector1 !== ySector2) {
            this._xSector = xSector2;
            this._ySector = ySector2;
            this._bNewSector = true;
        }
    }

    getMovement() {
        let m = this.entity;
        let loc = m.position;
        let spd = m.inertia;
        return {
            a: loc.angle,
            x: loc.x,
            y: loc.y,
            sx: spd.x,
            sy: spd.y,
        };
    }

    /**
     * Change movement speed
     * @param sx {number|Vector}
     * @param [sy] {number}
     */
    setSpeed(sx, sy = 0) {
        if (sx instanceof Vector) {
            this.changeMovement();
            this._speed.set(sx);
        } else if (sx !== this._speed.x || sy !== this._speed.y) {
            this.changeMovement();
            this._speed.set(sx, sy);
        }
    }


    /**
     * thinker main method
     */
    s_move() {
        let m = this.entity;
        m.inertia.set(0, 0);
        this.slide(this._speed);
    }

}

export default MoverThinker;