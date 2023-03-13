import VengefulThinker from "./VengefulThinker";

/**
 * Le fantome se dirige vers sa cible et la suit si elle se déplace.
 */
class WalkerThinker extends VengefulThinker {

    constructor() {
        super();
        this.ghostAI.defineStates({
            init: {
                loop: ['$moveTowardTarget']
            }
        })
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    $moveTowardTarget() {
        this.moveTowardTarget()
    }

}


export default WalkerThinker;