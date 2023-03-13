import VengefulThinker from "./VengefulThinker";

/**
 * Le fantome se dirige vers sa cible mais ne la suit pas spécialement.
 *
 * testé
 */
class WalkerThinker extends VengefulThinker {

    constructor() {
        super();
        this.ghostAI.defineStates({
            init: {
                init: ['$followishTarget'],
                jump: [{
                    test: '$elapsedTime 3000',
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

    $followishTarget() {
        this.moveTowardTarget()
    }

}

export default WalkerThinker;