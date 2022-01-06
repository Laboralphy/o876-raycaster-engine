import RusherThinker from "./RusherThinker";

const THINKER_ZIGZAG_PULSE = 8;

/**
 * Chase target with zigzag movement.
 * When close enough to target, rushes at constant angle... must be avoided.
 *
 * testé : correct
 */
class ZigZagRusherThinker extends RusherThinker {
    constructor() {
        super();
        this._zigzagTime = 0;
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    gs_chase() {
        ++this._zigzagTime;
        const a = -(Math.PI / 4) * Math.cos(Math.PI * this._zigzagTime / THINKER_ZIGZAG_PULSE);
        this.moveTowardTarget(1, a)
    }
}

export default ZigZagRusherThinker;
