const THINKER_METHOD_PREFIX = '$';

/**
 * a classe with basic mechanism to manage states.
 * this thinker has no "thinking" abilities whatsoever
 */
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