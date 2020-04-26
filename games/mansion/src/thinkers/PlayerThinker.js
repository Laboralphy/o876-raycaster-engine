import FPSControlThinker from "libs/engine/thinkers/FPSControlThinker";

class PlayerThinker extends FPSControlThinker {
    constructor() {
        super();
        this.setupCommands({
            use: [' ', 'Mouse0'],
        });
    }


    /**
     * rewrited behavior for pushing blocks
     * @param x
     * @param y
     */
    useBlock(x, y) {
        if (!this.entity.data.camera) {
            // push blocks only if camera is dropped
            this.engine.pushBlock(this.entity, x, y);
        }
    }

    setWalkingSpeed(n) {
        this.SPEED = n;
    }
}

export default PlayerThinker;