import VengefulThinker from "./VengefulThinker";

/**
 * Le fantome ne fait que suivre bêtement le target
 */
class ChaserThinker extends VengefulThinker {

    constructor() {
        super();
        this.transitions = {
            ...this.transitions,
            "s_idle": {
                "1": "s_seek_target"
            },

            "s_seek_target": {
                "t_target_found": "s_chase"
            },

            "s_chase": {
                "t_done_chasing": "s_seek_target"
            }
        }
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    s_seek_target() {
        // la cible est elle visible ?
        // oui : on
        // si on ne peut pas atteindre une cible...
        // despawn
    }

    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////

    t_seek_target() {

    }
}


export default ChaserThinker;