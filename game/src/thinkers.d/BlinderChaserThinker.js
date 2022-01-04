import VengefulThinker from "./VengefulThinker";

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
                // si timeout terminer, stoper pendant 500ms puis tirer
                ["gt_time_out", "gs_stop", "gs_time_250", "gs_shutter_chance_on", "gs_is_going_to_flash"]
            ],

            "gs_is_going_to_flash": [
                // tirer, attendre 2s puis re chaser
                ["gt_critical_wounded", "gs_time_1000", "gs_shutter_chance_off", "gs_pause_wounded"],
                ["gt_time_out", "gs_flash", "gs_time_250", "gs_shutter_chance_off", "gs_wait_after_flash"]
            ],

            "gs_wait_after_flash": [
                ["gt_time_out", "gs_chase", "gs_start_1"]
            ]
        }
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    gs_chase() {
        this.moveTowardTarget();
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
}

export default BlinderChaserThinker
