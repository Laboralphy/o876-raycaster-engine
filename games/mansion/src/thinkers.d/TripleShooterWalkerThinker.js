import VengefulThinker from "./VengefulThinker";

/**
 * Le fantome se déplace vers la cible en tirant des projectiles
 */
class TripleShooterWalkerThinker extends VengefulThinker {

    constructor() {
        super();
        this.ghostAI.transitions = {
            "gs_start": [
                [1, "gs_time_2000", "gs_chase", "gs_chasing"]
            ],

            "gs_start_1": [
                [1, "gs_time_shoot", "gs_chasing"]
            ],

            "gs_pause_wounded": [
                ["gt_time_out", "gs_start_1"]
            ],

            "gs_chasing": [
                // si timeout terminer, stoper pendant 500ms puis tirer
                ["gt_time_out", "gs_stop", "gs_time_250", "gs_shutter_chance_on", "gs_is_going_to_shoot"]
            ],

            "gs_is_going_to_shoot": [
                // tirer, attendre 2s puis re chaser
                ["gt_critical_wounded", "gs_time_1000", "gs_shutter_chance_off", "gs_pause_wounded"],
                ["gt_time_out", "gs_shoot", "gs_time_500", "gs_shutter_chance_off", "gs_is_going_to_shoot_2"]
            ],

            "gs_is_going_to_shoot_2": [
                // tirer, attendre 2s puis re chaser
                ["gt_time_out", "gs_shoot", "gs_time_500", "gs_is_going_to_shoot_3"]
            ],

            "gs_is_going_to_shoot_3": [
                // tirer, attendre 2s puis re chaser
                ["gt_time_out", "gs_shoot", "gs_time_500", "gs_wait_after_shoot"]
            ],

            "gs_wait_after_shoot": [
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
    gs_time_shoot () {
        const nTime = Math.floor(Math.random() * 2000) + 3000
        this._setGhostTimeOut(nTime);
    }

    gs_stop() {
        this.moveTowardTarget(0, 0);
    }

    gs_shoot() {
        this.moveTowardTarget(0, 0);
        // tirer un projectile
        const missile = this.engine.createEntity('p_linear_magbolt', this.entity.position);
        missile.thinker.fire(this.entity);
    }
}

export default TripleShooterWalkerThinker
