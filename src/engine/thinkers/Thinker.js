import {computeWallCollisions} from "../../wall-collider";

const THINKER_METHOD_PREFIX = '$';

class Thinker {
    constructor() {
        this._state = 'idle';
        this._duration = 0;
        this._nextState = 'idle';
        this._entity = null;
        this._engine = null;
    }

    get entity() {
        return this._entity;
    }

    set entity(value) {
        this._entity = value;
    }

    get engine() {
        return this._engine;
    }

    set engine(value) {
        this._engine = value;
    }

    /**
     * Invoke a method in this instance
     * @param sMeth
     */
    _invoke(sMeth) {
        if (sMeth in this) {
            this[sMeth]();
        }
    }

    /**
     * set an idle state
     */
    idle() {
        this.state = 'idle';
    }

    /**
     * Defines a a duration of the current state. After the duration, the state goes to "_newState"
     * @param n {number}
     */
    duration(n) {
        this._duration = n;
    }

    /**
     * Le prochain etat une fois que celui en cour sera terminé
     * @param s {string} state
     * @param d {number} duration
     * @return {*}
     */
    next(s, d = Infinity) {
        this._nextState = s;
        this._duration = d;
    }

    /**
     * defines a new state
     * @param value {string}
     */
    set state(value) {
        this.next('idle');
        this._invoke(THINKER_METHOD_PREFIX + this._state + '_exit');
        this._state = value;
        this._invoke(THINKER_METHOD_PREFIX + this._state + '_enter');
        return this;
    }

    get state() {
        return this._state;
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

    /**
     * thinks
     */
    think() {
        this._invoke(THINKER_METHOD_PREFIX + this._state);
        if (--this._duration <= 0) {
            this._duration = Infinity;
            this.state = this._nextState;
        }
    }

    $idle() {

    }
}

export default Thinker;