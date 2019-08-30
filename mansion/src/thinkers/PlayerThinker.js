import FPSControlThinker from "../../../lib/src/engine/thinkers/FPSControlThinker";

class PlayerThinker extends FPSControlThinker {
    constructor() {
        super();
        this.setupCommands({
            use: [' ', 'Mouse0'],
            camera: ['Mouse1']
        })
    }

    $move() {
        super.$move();
        if (this.isCommandOn('camera')) {
            this.clearCommand('camera');

        }
    }
}

export default PlayerThinker;