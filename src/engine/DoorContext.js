import Easing from "../tools/Easing";
import EventEmitter from "events";
import * as CONSTS from "./consts";

/**
 * A door context is created whenever a door is opened, and is about to automaticaly close
 */
class DoorContext {


    constructor({sdur = 0, mdur = 0, ddur = 0, ofsmax = 0, sfunc = Easing.SMOOTHSTEP}) {
        this._phase = 0;        // current phase
        this._time = 0;         // elapsed time
        this._slidingDuration = sdur;     // sliding duration
        this._maintainDuration = mdur;     // duration while door is openend
        this._delayDuration = ddur;    // duration before door actually opens
        this._offset = 0;       // offset transmitted to door
        this._offsetMax = ofsmax;
        this._easing = new Easing();
        this._easing.setFunction(sfunc);
        this.event = new EventEmitter();

        // public properties
        // for information only (not used in this class)
        this.data = {};
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

    isOpen() {
        return this._phase === CONSTS.DOOR_PHASE_OPEN;
    }

    isDone() {
        return this._phase === CONSTS.DOOR_PHASE_DONE;
    }

    /**
     * will close the door, if not already in phase CLOSING.
     * This is a good way to manually close doors that never autoclose.
     */
    close() {
        if (this._phase < CONSTS.DOOR_PHASE_CLOSING) {
            const checkEvent = {context: this, cancel: false};
            this.event.emit('check', checkEvent);
            if (!checkEvent.cancel) {
                this.initPhase(CONSTS.DOOR_PHASE_CLOSING);
            }
        }
    }

    dispose() {
        this.initPhase(CONSTS.DOOR_PHASE_DONE);
    }

    /**
     * sets a new phase
     * @param phase
     */
    initPhase(phase) {
        const easing = this._easing;
        this._phase = phase;
        switch (phase) {

            // the door is in its initial state
            case CONSTS.DOOR_PHASE_CLOSE:
                this._time = 0;
                break;

            // the door will open. Easing must be initialized
            case CONSTS.DOOR_PHASE_OPENING:
                easing.setOutputRange(0, this._offsetMax);
                easing.setStepCount(this._slidingDuration);
                this._time = 0;
                this.event.emit('opening');
                break;

            // the door is currently opening
            case CONSTS.DOOR_PHASE_OPEN:
                this._time = this._maintainDuration;
                this.event.emit('open');
                break;

            // the door is fully open, waiting for autoclose
            case CONSTS.DOOR_PHASE_CLOSING:
                const checkEvent = {context: this, cancel: false};
                this.event.emit('check', checkEvent);
                if (checkEvent.cancel) {
                    // the door closing has been cancel : something in the way ?
                    // back to phase OPEN with reduced maintain duration
                    this._time = CONSTS.DOOR_SECURITY_INTERVAL;
                    this._phase = CONSTS.DOOR_PHASE_OPEN;
                } else {
                    easing.setOutputRange(this._offsetMax, 0);
                    easing.setStepCount(this._slidingDuration);
                    this._time = 0;
                    this.event.emit('closing');
                }
                break;


            // the door is now closed
            case CONSTS.DOOR_PHASE_DONE:
                this._time = 0;
                this._offset = 0;
                this.event.emit('close');
                break;
        }
    }

    process() {
        const easing = this._easing;
        switch (this._phase) {

            // the door is about to open
            case CONSTS.DOOR_PHASE_CLOSE:
                if (++this._time >= this._delayDuration) {
                    this.initPhase(CONSTS.DOOR_PHASE_OPENING);
                }
                break;

            // the door is currently sliding and opening
            case CONSTS.DOOR_PHASE_OPENING:
                this._offset = easing.compute(++this._time).y;
                if (easing.over()) {
                    this.initPhase(CONSTS.DOOR_PHASE_OPEN);
                }
                break;

            // the door is fully open, waiting for autoclose
            case CONSTS.DOOR_PHASE_OPEN:
                if (--this._time <= 0) {
                    this.initPhase(CONSTS.DOOR_PHASE_CLOSING);
                }
                break;

            // the door is closing
            case CONSTS.DOOR_PHASE_CLOSING:
                this._offset = easing.compute(++this._time).y;
                if (easing.over()) {
                    this.initPhase(CONSTS.DOOR_PHASE_DONE);
                }
                break;

            // the door is now closed
            case CONSTS.DOOR_PHASE_DONE:
                break;
        }
    }
}

export default DoorContext;