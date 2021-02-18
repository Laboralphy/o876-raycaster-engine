import VengefulThinker from "./VengefulThinker";

const ZIGZAG_PULSE = 8;

/**
 * Le fantome ne fait que suivre bêtement le target
 */
class ZigZagChaserThinker extends VengefulThinker {

    constructor() {
        super();
        this.ghostAI.verbose = true;
        this.ghostAI.transitions = {
            "gs_init": [
                [1, "gs_zigzag"],
            ],
            "gs_zigzag": [
                ["t_target_close", "gs_go_straight"],
            ],
            "gs_go_straight": [
                ["t_target_far", "gs_zigzag"]
            ]
        };
        this._zigzagTime = 0;
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    gs_zigzag() {
        ++this._zigzagTime;
        const a = -(Math.PI / 4) * Math.cos(Math.PI * this._zigzagTime / ZIGZAG_PULSE);
        this.moveTowardTarget(1, a)
    }

    gs_go_straight() {
        ++this._zigzagTime;
    }

    // gs_zigzag_left() {
    //     this._zigzagLastDir = ZIGZAG_DIRECTION_LEFT;
    //     --this._zigzagDuration;
    //     ++this._zigzagTime;
    //     const a = (Math.PI / 4) * Math.sin(Math.PI * this._zigzagTime / ZIGZAG_MAX_DURATION);
    //     this.moveTowardTarget(1, a)
    // }

    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////

    t_target_close () {
        return this.getDistanceToTarget() < 64;
    }

    t_target_far () {
        return this.getDistanceToTarget() > 128;
    }
}

export default ZigZagChaserThinker;
