import VengefulThinker from "./VengefulThinker";

/**
 * 1) le fantôme se dirige vers la cible et corrige constament son mouvement pour toujours suivre la cible.
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
}

export default ChaserThinker;