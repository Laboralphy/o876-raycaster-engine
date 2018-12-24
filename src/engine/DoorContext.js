import Easing from "../tools/Easing";

const PHASE_DOOR_CLOSE = 0;          // initial state : door is closed and not openned yet
const PHASE_DOOR_OPENING = 1;        // door is opening
const PHASE_DOOR_OPEN = 2;           // door is totaly open, the cell become walkable
const PHASE_DOOR_CLOSING = 3;        // door is closing, the cell is unwalkable
const PHASE_DOOR_DONE = 4;           // door has finished closing and the context must be reinitialized

/**
 * This class computes door offset.
 */
class DoorContext {


    constructor({sdur = 0, mdur = 0, ofsmax = 0}) {
        this._phase = 0;        // current phase
        this._time = 0;         // elapsed time
        this._slidingDuration = sdur;     // sliding duration
        this._maintainDuration = mdur;     // duration while door is openend
        this._offset = 0;       // offset transmitted to door
        this._offsetMax = ofsmax;
        this._easing = new Easing();
    }

    reset() {
        this._phase = 0;
        this._time = 0;
        this._offset = 0;
    }

    setState({phase, time}) {
        this.initPhase(phase);
        this._time = time;
    }

    getState() {
        return {
            phase: this._phase,
            time: this._time
        };
    }

    getPhase() {
        return this._phase;
    }

    get offset() {
        return this._offset;
    }

    isShutDown() {
        return this._phase === PHASE_DOOR_DONE;
    }

    /**
     * sets a new phase
     * @param phase
     */
    initPhase(phase) {
        const easing = this._easing;
        this._phase = phase;
        switch (phase) {
            case PHASE_DOOR_CLOSE:
                break;

            case PHASE_DOOR_OPENING:
                // the door will open. Easing must be initialized
                easing.setOutputRange(0, this._offsetMax);
                easing.setStepCount(this._slidingDuration);
                easing.setFunction(Easing.SMOOTHSTEP);
                this._time = 0;
                break;

            case PHASE_DOOR_OPEN:
                // the door is currently opening
                this._time = this._maintainDuration;
                break;

            case PHASE_DOOR_CLOSING:
                // the door is fully open, waiting for autoclose
                easing.setOutputRange(this._offsetMax, 0);
                easing.setStepCount(this._slidingDuration);
                easing.setFunction(Easing.SMOOTHSTEP);
                this._time = 0;
                break;


            case PHASE_DOOR_DONE:
                // the door is now closed
                break;
        }
    }

    process() {
        const easing = this._easing;
        switch (this._phase) {
            case PHASE_DOOR_CLOSE:
                // the door is about to open
                this.initPhase(PHASE_DOOR_OPENING);
                break;

            case PHASE_DOOR_OPENING:
                // the door is currently sliding and opening
                this._offset = easing.compute(++this._time).y;
                if (easing.over()) {
                    this.initPhase(PHASE_DOOR_OPEN);
                }
                break;

            case PHASE_DOOR_OPEN:
                // the door is fully open, waiting for autoclose
                if (--this._time <= 0) {
                    this.initPhase(PHASE_DOOR_CLOSING);
                }
                break;

            case PHASE_DOOR_CLOSING:
                // the door is closing
                this._offset = easing.compute(++this._time).y;
                if (easing.over()) {
                    this.initPhase(PHASE_DOOR_DONE);
                }
                break;

            case PHASE_DOOR_DONE:
                // the door is now closed
                break;
        }
    }
}

export default DoorContext;