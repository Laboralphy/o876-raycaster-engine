import VengefulThinker from "./VengefulThinker";
import Blindness from "../filters/Blindness";
import Timed from '../../../libs/engine/filters/Timed';

const THINKER_DISTANCE_RUSH = 256; // distance à laquel le ghost va rusher

/**
 * Le fantome se déplace vers la cible en tirant des projectiles
 */
class BlinderChaserThinker extends VengefulThinker {

    constructor() {
        super();
        this.ghostAI.transitions = {
            "gs_start": [
                [1, "gs_time_2000", "gs_chase", "gs_chasing"]
            ],

            "gs_start_1": [
                [1, "gs_time_flash", "gs_chasing"]
            ],

            "gs_pause_wounded": [
                ["gt_time_out", "gs_start_1"]
            ],

            "gs_chasing": [
                // si timeout terminé, stopper pendant 250 ms puis fatal frame on & flasher
                ["gt_time_out", "gs_stop", "gs_time_250", "gs_flash", "gs_shutter_chance_on", "gs_is_going_to_flash"]
            ],

            "gs_is_going_to_flash": [
                // si photo ; cadrage fatal off, anime de blessage puis attendre 1000
                ["gt_critical_wounded", "gs_time_1000", "gs_shutter_chance_off", "gs_pause_wounded"],
                // flasher, cadrage fatal off, puis attendre 250 ms
                ["gt_time_out", "gs_fire_flash", "gs_shutter_chance_off", "gs_go_rush"]
            ],

            "gs_go_rush": [
                [1, "gs_rush_init", "gs_rush"]
            ],

            "gs_rush": [
                ["t_target_not_found", "gs_start_1"],
                ["gt_hit_wall", "gs_start_1"],
                ["gt_wounded", "gs_start_1"]
            ]
        }
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    gs_fire_flash () {
        if (this.t_target_found()) {
            const oBlind = new Blindness()
            const oTime = new Timed({ child: oBlind, duration: 3000 })
            this.engine.filters.link(oTime)
        }
    }

    gs_chase() {
        this.moveTowardTarget();
    }

    gs_chasing() {
        this.moveTowardTarget();
    }

    gs_rush_init() {
        // define rush vector
        this.moveTowardTarget(4, 0);
    }

    /**
     * Randomly choose timer between 3 and 5s
     */
    gs_time_flash () {
        this._setGhostTimeOut(Math.floor(Math.random() * 1000) + 4000);
    }

    gs_stop() {
        this.moveTowardTarget(0, 0);
    }

    gs_flash() {
        this.moveTowardTarget(0, 0);
        this.engine.createEntity('o_flare', this.entity.position);
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

export default BlinderChaserThinker
