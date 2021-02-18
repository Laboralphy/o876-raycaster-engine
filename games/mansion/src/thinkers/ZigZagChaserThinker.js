import VengefulThinker from "./VengefulThinker";

const ZIGZAG_DIRECTION_LEFT = 1;
const ZIGZAG_DIRECTION_RIGHT = -1;

/**
 * Le fantome ne fait que suivre bêtement le target
 */
class ZigZagChaserThinker extends VengefulThinker {

    constructor() {
        super();
        this.ghostAI.transitions = {
            "gs_init": [
                ["t_target_close", "gs_go_straight"],
                ["t_last_zigzag_was_right", "gs_zigzag_init", "gs_zigzag_left"],
                ["t_last_zigzag_was_left", "gs_zigzag_init", "gs_zigzag_right"]
            ],
            "gs_zigzag_left": [
                ["t_zigzag_done", "gs_init"]
            ],
            "gs_zigzag_right": [
                ["t_zigzag_done", "gs_init"]
            ],
            "gs_go_straight": [
                ["t_target_far", "gs_init"]
            ]
        };
        this._zigzagDuration = 0;
        this._zigzagLastDir = 0;
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    gs_zigzag_init () {
        this._zigzagDuration = 4;
    }

    gs_zigzag_left() {
        this._zigzagLastDir = ZIGZAG_DIRECTION_LEFT;
        // set vector at 45deg to the left
        this.entity.position.angle -= Math.PI / 4;
        this.moveForward();
    }

    gs_zigzag_right() {
        this._zigzagLastDir = ZIGZAG_DIRECTION_RIGHT;
        // set vector at 45deg to the right
        this.entity.position.angle += Math.PI / 4;
        this.moveForward();
    }

    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////

    t_zigzag_done () {
        return this._zigzagDuration <= 0;
    }

    t_last_zigzag_was_left () {
        return this._zigzagLastDir === ZIGZAG_DIRECTION_LEFT;
    }

    t_last_zigzag_was_right () {
        return !this.t_last_zigzag_was_left();
    }

    t_target_close () {
        return this.getDistanceToTarget() < 64;
    }

    t_target_far () {
        return this.getDistanceToTarget() > 128;
    }
}

export default ZigZagChaserThinker;
