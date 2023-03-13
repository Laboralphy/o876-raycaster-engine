import VengefulThinker from "./VengefulThinker";

/**
 * Le fantome se dirige vers sa cible et la suit si elle se déplace.
 * Le fantome fait des pause dans son déplacement
 *
 * testé
 */
class PartialChaserThinker extends VengefulThinker {

    constructor() {
        super();
        this.ghostAI.defineStates({
            init: {
                loop: ['$followTarget'],
                jump: [{
                    test: '$elapsedTime 5000',
                    state: 'wait'
                }]
            },
            wait: {
                init: ['$stop'],
                jump: [{
                    test: '$elapsedTime 2000',
                    state: 'init'
                }]
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

export default PartialChaserThinker;