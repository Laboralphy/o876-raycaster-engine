import FPSControlThinker from "../../../lib/src/engine/thinkers/FPSControlThinker";

class PlayerThinker extends FPSControlThinker {
    constructor() {
        super();
        console.log('using PlayerThinker');
    }
}

export default PlayerThinker;