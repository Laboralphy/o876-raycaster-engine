import Automaton from "../../automaton";

/**
 * a class with basic mechanism to manage states.
 * this thinker has no "thinking" abilities whatsoever
 */
class Thinker {
    constructor() {
        this._context = null;
        this._timeStart = null;
        this._entity = null;
        this._engine = null;
        this._automaton = new Automaton();
        this._automaton.instance = this;
        // this.defineTransistions({
        //     "idle": []
        // });
    }

    get context() {
        return this._context;
    }

    get automaton() {
        return this._automaton;
    }

    get transitions() {
        return this._automaton.transitions;
    }

    set transitions(value) {
        this._automaton.transitions = value;
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
     * return elapsed time since creation or since modification
     * @return {number}
     */
    get elapsedTime() {
        return this._engine.getTime() - this._timeStart;
    }

    set elapsedTime(value) {
        this._timeStart = this._engine.getTime() - value;
    }

    /**
     * thinks
     */
    think() {
        if (this._timeStart === null) {
            this._timeStart = this._engine.getTime()
        }
        this._automaton.process();
    }
}

export default Thinker;