import TangibleThinker from "../../src/engine/thinkers/TangibleThinker";

/**
 * this thinker is suitable for moving entities that can interact with other tangible entities
 * the collider and force field instances allows this thinker to properly react after any collision
 */
class FurnThinker extends TangibleThinker {
    constructor() {
        super();
        this._static = true;
    }

    processForces() {
        super.processForces();
    }
}

export default FurnThinker;