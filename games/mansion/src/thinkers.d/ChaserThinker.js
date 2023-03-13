import VengefulThinker from "./VengefulThinker";

/**
 * Le fantome se dirige vers sa cible et la suit si elle se déplace.
 * Le fantome ne s'arrete pas
 *
 * Testé
 */
class ChaserThinker extends VengefulThinker {

    constructor() {
        super();
        this.ghostAI.defineStates({
            init: {
                loop: ['$followTarget'],
            }
        })
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    $followTarget() {
        this.moveTowardTarget()
    }

}

export default ChaserThinker;