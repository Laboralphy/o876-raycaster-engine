import VengefulThinker from "./VengefulThinker";

/**
 * Le fantome ne fait que suivre bêtement le target
 *
 * testé : fonctionne comme prévu
 */
class ChaserThinker extends VengefulThinker {

    constructor() {
        super();
        this.ghostAI.transitions = {
            "gs_start": [
                [1, "gs_chase"]
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


export default ChaserThinker;