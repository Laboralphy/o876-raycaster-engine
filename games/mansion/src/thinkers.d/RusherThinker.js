import VengefulThinker from "./VengefulThinker";

const THINKER_DISTANCE_RUSH = 256; // distance à laquel le ghost va rusher

/**
 * Chase target directly.
 * When close enough to target, rushes at constant angle... must be avoided.
 *
 * testé : fonctionne bien, mais après téléportation de recherche : peut rusher dans une direction éronée
 */
class RusherThinker extends VengefulThinker {
    constructor() {
        super();
        this.ghostAI.transitions = {
            "gs_init": [
                [1, "gs_stop", "gs_shutter_chance_off", "gs_chase"]
            ],

            "gs_chase": [
                ["gt_target_close", "gs_shutter_chance_on", "gs_time_500", "gs_stop", "gs_wait_before_rush"]
            ],

            "gs_wait_before_rush": [
                ["gt_time_out", "gs_rush_init", "gs_shutter_chance_off", "gs_rush"]
            ],

            "gs_rush": [
                ["t_target_not_found", "gs_init"],
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
        return this.getDistanceToTarget() < THINKER_DISTANCE_RUSH;
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
