import MoverThinker from "./MoverThinker";


/**
 * this thinker is suitable for moving entities that can interact with other tangible entities
 * the collider and force field instances allows this thinker to properly react after any collision
 */
class TangibleThinker extends MoverThinker {

    constructor() {
        super();
        this.transitions = {
            "s_init": [[1, "s_move"]],
            "s_move": []
        };
        this.automaton.state = "s_init";
    }

    processForces() {
        // synchronizing dummy position
        const engine = this.engine;
        const entity = this.entity;
        const dummy = entity.dummy;
        engine.syncEntityDummy(entity);
        const f = engine.smasher.getSmashingForce(dummy);
        this.slide(f);
        dummy.position.set(entity.position.x, entity.position.y);
    }


    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    s_init() {
        this.engine.smasher.registerDummy(this.entity.dummy);
        this.processForces();
    }

    s_move() {
        super.s_move();
        this.processForces();
    }
}

export default TangibleThinker;