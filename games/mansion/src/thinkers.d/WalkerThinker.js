import VengefulThinker from "./VengefulThinker";

/**
 * Le fantome ne fait que suivre bêtement le target
 *
 * testé : fonctionne comme prévu
 */
class WalkerThinker extends VengefulThinker {

    constructor() {
        super();
        this.ghostAI.transitions = {
            "gs_start": [
                [1, "gs_chase", "gs_time_2000", "gs_walk"]
            ],

            "gs_walk": [
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

}


export default WalkerThinker;