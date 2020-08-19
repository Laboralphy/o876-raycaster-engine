import VengefulThinker from "./VengefulThinker";

/**
 * Le fantome ne fait que suivre bêtement le target
 */
class ChaserThinker extends VengefulThinker {

    constructor() {
        super();
        this.transitions = {
            // recherche joueur cible
            "s_idle": [
                // trouver : commencer la chasse
                ["t_target_found", "s_look_at_target", "s_time_250", "s_walk"],
                // attendre 1 seconde puis refaire une recherche
                ["t_target_not_found", "s_time_1000", "s_wait_seek"]
            ],

            // attendre le time out avant de refaire une recherche
            "s_wait_seek": [
                ["t_time_out", "s_idle"]
            ],

            // marcher mais verifier qu'on a toujour le joueur en vue
            "s_walk": [
                ["t_time_out", "s_idle"]
            ]
        };
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    s_init() {
        super.s_init();
    }

    s_look_at_target() {
        // rechercher la cible
        this.lookAtTarget();
    }

    s_walk() {
        this.moveForward();
    }

    s_wait_seek() {
        this.pulse();
        this.updateVisibilityData();
    }


    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////

    t_target_found() {
        return this.isEntityVisible(this.target);
    }

    t_target_not_found() {
        return !this.t_target_found();
    }
}


export default ChaserThinker;