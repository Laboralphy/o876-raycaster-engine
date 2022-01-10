import VengefulThinker from "./VengefulThinker";

const THINKER_ZIGZAG_PULSE = 8;
const THINKER_ZIGZAG_CLOSE_RANGE = 256;
const THINKER_ZIGZAG_SECURITY_RANGE = 64;


/**
 * Le fantome ne fait que suivre bêtement le target
 *
 * testé : fonctionne correctement
 */
class ZigZagTeleChaserThinker extends VengefulThinker {

    constructor() {
        super();
        this.ghostAI.transitions = {
            "gs_init": [
                [1, "gs_zigzag"],
            ],
            "gs_zigzag": [
                ["gt_target_close", "gs_teleport_behind", "gs_shutter_chance_on", "gs_stop", "gs_teleport_out"]
            ],

            "gs_teleport_out": [
                ["gt_has_teleported", "gs_shutter_chance_off", "gs_go_straight"]
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
        const a = -(Math.PI / 4) * Math.cos(Math.PI * this._zigzagTime / THINKER_ZIGZAG_PULSE);
        this.moveTowardTarget(1, a)
    }

    gs_go_straight() {
        ++this._zigzagTime;
        this.moveTowardTarget(1, 0)
    }

    gs_teleport_behind () {
        this.computeTeleportBehind();
    }

    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////

    gt_target_close () {
        return this.getDistanceToTarget() < THINKER_ZIGZAG_CLOSE_RANGE;
    }

    t_target_far () {
        return this.getDistanceToTarget() > (THINKER_ZIGZAG_CLOSE_RANGE + THINKER_ZIGZAG_SECURITY_RANGE);
    }
}

export default ZigZagTeleChaserThinker;
