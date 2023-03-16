import VengefulThinker from "./VengefulThinker";

/**
 * 1) le fantôme se dirige vers la cible et corrige constamment son mouvement pour toujours suivre la cible.
 *
 * Testé le 2023-03-15
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
}

export default ChaserThinker;