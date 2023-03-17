//import Dummy from "../../collider/Dummy";
import Thinker from "./Thinker";


/**
 * this thinker is suitable for moving entities that do not interact with other tangible entities
 */
class StaticThinker extends Thinker {
    constructor() {
        super();
        this.automaton.defineStates({
            "main": {
            }
        });
    }
}

export default StaticThinker;