import Automaton from "../../automaton/v2";

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
        this._automaton.events.on('test', ({
            test,
            parameters,
            pass
        }) => {
            pass(this._invoke(test, ...parameters))
        })
        this._automaton.events.on('action', ({
            action,
            parameters
        }) => {
            this._invoke(action, ...parameters)
        })
    }

    get debugString () {
        return this._entity
    }

    get context() {
        return this._context;
    }

    get automaton() {
        return this._automaton;
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
     * @param parameters {*}
     */
    _invoke(sMeth, ...parameters) {
        if (sMeth in this) {
            return this[sMeth](...parameters);
        } else {
            throw new Error('This method "' + sMeth + '" does not existe in this thinker.')
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
