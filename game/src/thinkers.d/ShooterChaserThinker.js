import VengefulThinker from "./VengefulThinker";

/**
 * Le fantome se déplace vers la cible en tirant des projectiles
 */
class ShooterChaserThinker extends VengefulThinker {

    constructor() {
        super();
        this.ghostAI.transitions = {
            "gs_start": [
                [1, "gs_time_shoot", "gs_chasing"]
            ],

            "gs_chasing": [
                // si timeout terminer, stoper pendant 500ms puis tirer
                ["gt_time_out", "gs_stop", "gs_time_250", "gs_shutter_chance_on", "gs_is_going_to_shoot"]
            ],

            "gs_is_going_to_shoot": [
                // tirer, attendre 2s puis re chaser
                ["gt_time_out", "gs_shoot", "gs_time_2000", "gs_shutter_chance_off", "gs_wait_after_shoot"]
            ],

            "gs_wait_after_shoot": [
                ["gt_time_out", "gs_start"]
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
        this._setGhostTimeOut(Math.floor(Math.random() * 2000) + 3000);
    }

    gs_stop() {
        this.moveTowardTarget(0, 0);
    }

    gs_shoot() {
        this.moveTowardTarget();
        // tirer un projectile
        const missile = this.engine.createEntity('p_linear_magbolt', this.entity.position);
        missile.thinker.fire(this.entity);
    }
}

export default ShooterChaserThinker