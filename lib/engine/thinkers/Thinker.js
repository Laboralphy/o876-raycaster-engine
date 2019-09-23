import Automaton from "../../automaton";

/**
 * a class with basic mechanism to manage states.
 * this thinker has no "thinking" abilities whatsoever
 */
class Thinker {
    constructor() {
        this._duration = 0;
        this._entity = null;
        this._engine = null;
        this._automaton = new Automaton();
        this._automaton.instance = this;
        this.defineTransistions({
            "idle": {}
        });
    }

    defineTransistions(f) {
        this._automaton.transitions = f;
    }

    emit(sEvent, payload) {
        if (this.engine) {
            this.engine.events.emit('think.' + sEvent, {
                ...payload,
                emitter: this._entity
            });
        }
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
     * Defines a a duration of the current state. After the duration, the state goes to "_newState"
     * @param n {number}
     */
    duration(n) {
        this._duration = n;
    }

    /**
     * thinks
     */
    think() {
        this._automaton.process();
    }
}

export default Thinker;