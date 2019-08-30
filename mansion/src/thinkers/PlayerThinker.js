import FPSControlThinker from "../../../lib/src/engine/thinkers/FPSControlThinker";

class PlayerThinker extends FPSControlThinker {
    constructor() {
        super();
        this.setupKeys({
            use: [' ', 'Mouse0'],
            camera: ['Mouse1']
        })
    }

    $move() {
        super.$move();
        if (this._keys.camera.state !== false) {
            this._keys.camera.state = false;

        }
    }
}

export default PlayerThinker;