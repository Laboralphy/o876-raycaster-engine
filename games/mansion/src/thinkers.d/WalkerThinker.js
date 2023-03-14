import VengefulThinker from "./VengefulThinker";

/**
 * 1) le fantôme démarre un mouvement vers sa cible, il se dirige en ligne droite sans changer de cap,
 * le mouvement dure 3 secondes
 *
 * 2) le fantôme reste immobile pendant 1 seconde
 *
 * testé
 */
class WalkerThinker extends VengefulThinker {
    constructor() {
        super();
        this.ghostAI.defineStates({
            init: {
                init: ['$followTarget'],
                jump: [{
                    test: '$elapsedTime 3000',
                    state: 'wait'
                }]
            },
            wait: {
                init: ['$stop'],
                jump: [{
                    test: '$elapsedTime 1000',
                    state: 'init'
                }]
            }
        })
    }
}

export default WalkerThinker;