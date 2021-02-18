import VengefulThinker from "./VengefulThinker";

/**
 * Chase target directly.
 * When close enough to target, rushes at constant angle... must be avoided.
 */
class RusherThinker extends VengefulThinker {
    constructor() {
        super();
        this.ghostAI.transitions = {
            "gs_init": [
                [1, "gs_shutter_chance_off", "gs_chase"]
            ],

            "gs_chase": [
                ["gt_target_close", "gs_shutter_chance_on", "gs_time_500", "gs_stop", "gs_wait_before_rush"]
            ],

            "gs_wait_before_rush": [
                ["gt_time_out", "gs_rush_init", "gs_rush"]
            ],

            "gs_rush": [
                ["gt_hit_wall", "gs_init"],
                ["gt_wounded", "gs_init"]
            ]
        };
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    gs_chase() {
        this.moveTowardTarget();
    }

    gs_rush_init() {
        // define rush vector
        this.moveTowardTarget(4, 0);
    }

    gs_stop() {
        this.moveTowardTarget(0, 0);
    }

    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////

    gt_target_close () {
        return this.getDistanceToTarget() < 256;
    }

    /**
     * returns true if this entity hits something (wall or other entity)
     * @return {boolean}
     */
    gt_hit_wall() {
        return !!this._cwc.wcf.c;
    }
}

export default RusherThinker;