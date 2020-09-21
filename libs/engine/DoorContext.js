import Easing from "../easing";
import EventEmitter from "events";
import * as CONSTS from "./consts";

const SERIAL_VERSION = 1;


/**
 * A door context is created whenever a door is opened, and is about to automaticaly close
 */
class DoorContext {

    /**
     *
     * @param sdur {number} duration of the sliding phase
     * @param mdur {number} duration of the maintaining phase
     * @param ddur {number} duration of the delay before the door opens
     * @param ofsmax {number} maximum value of offset
     * @param sfunc {string} name of opening function
     * @param cfunc {string} name of closing function
     */
    constructor({sdur = 0, mdur = 0, ddur = 0, ofsmax = 0, sfunc = Easing.SMOOTHSTEP, cfunc = ''}) {
        this._phase = 0;        // current phase
        this._time = 0;         // elapsed time
        this._slidingDuration = sdur;     // sliding duration
        this._maintainDuration = mdur;     // duration while door is openend
        this._delayDuration = ddur;    // duration before door actually opens
        this._offset = 0;       // offset transmitted to door
        this._offsetMax = ofsmax;
        this._sfunc = sfunc; // fonction ouverture
        this._cfunc = cfunc !== '' ? cfunc : sfunc;
        this._easing = new Easing();
        this._easing.setFunction(this._sfunc);
        this._events = new EventEmitter();
        this._data = {};
    }

    get data() {
        return this._data;
    }

    get events() {
        return this._events;
    }

    get state() {
        return {
            version: SERIAL_VERSION,
            phase: this._phase,
            time: this._time,
            slidingDuration: this._slidingDuration,
            maintainDuration: this._maintainDuration,
            delayDuration: this._delayDuration,
            offset: this._offset,
            offsetMax: this._offsetMax,
            sfunc: this._sfunc,
            cfunc: this._cfunc,
            easingx: this._easing.x,
            data: Object.assign({}, this._data)
        };
    }

    set state(oState) {
        if (oState.version !== SERIAL_VERSION) {
            throw new Error('Bad serialization version - class DoorContext - expected v' + SERIAL_VERSION + ' - got v' + oState.version);
        }
        this._data = Object.assign({}, oState.data);
        this._phase = oState.phase;
        this._slidingDuration = oState.slidingDuration;
        this._maintainDuration = oState.maintainDuration;
        this._delayDuration = oState.delayDuration;
        this._offset = oState.offset;
        this._offsetMax = oState.offsetMax;
        this._sfunc = oState.sfunc;
        this._cfunc = oState.cfunc;
        this._easing.setFunction(this._sfunc);
        this.initPhase(this._phase);
        this._time = oState.time;
        this._easing.compute(oState.easingx);
    }

    reset() {
        this._phase = 0;
        this._time = 0;
        this._offset = 0;
    }

    setState({phase, time}) {
        this._time = time;
        this.initPhase(phase);
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

    isClosed() {
        return this._phase === CONSTS.DOOR_PHASE_CLOSED || this._phase === CONSTS.DOOR_PHASE_DONE;
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
            this.initPhase(CONSTS.DOOR_PHASE_CLOSING);
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
            case CONSTS.DOOR_PHASE_CLOSED:
                this._time = 0;
                break;

            // the door will open. Easing must be initialized
            case CONSTS.DOOR_PHASE_OPENING:
                easing.setOutputRange(0, this._offsetMax);
                easing.setStepCount(this._slidingDuration);
                this._time = 0;
                this.events.emit('opening');
                break;

            // the door is currently opening
            case CONSTS.DOOR_PHASE_OPEN:
                this._time = this._maintainDuration;
                this.events.emit('open');
                break;

            // the door is fully open, waiting for autoclose
            case CONSTS.DOOR_PHASE_CLOSING:
                const checkEvent = {context: this, cancel: false};
                this.events.emit('check', checkEvent);
                if (checkEvent.cancel) {
                    // the door closing has been cancel : something in the way ?
                    // back to phase OPEN with reduced maintain duration
                    this._time = CONSTS.DOOR_SECURITY_INTERVAL;
                    this._phase = CONSTS.DOOR_PHASE_OPEN;
                } else {
                    easing.setOutputRange(this._offsetMax, 0);
                    easing.setStepCount(this._slidingDuration);
                    easing.setFunction(this._cfunc);
                    this._time = 0;
                    this.events.emit('closing');
                }
                break;


            // the door is now closed
            case CONSTS.DOOR_PHASE_DONE:
                this._time = 0;
                this._offset = 0;
                this.events.emit('close');
                break;
        }
    }

    process() {
        const easing = this._easing;
        switch (this._phase) {

            // the door is about to open
            case CONSTS.DOOR_PHASE_CLOSED:
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