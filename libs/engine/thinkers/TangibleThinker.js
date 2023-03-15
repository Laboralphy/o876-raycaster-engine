import MoverThinker from "./MoverThinker";


/**
 * this thinker is suitable for moving entities that can interact with other tangible entities
 * the collider and force field instances allows this thinker to properly react after any collision
 */
class TangibleThinker extends MoverThinker {

    constructor() {
        super();
        this.automaton.defineStates({
            main: {
                init: ['$init'],
                loop: ['$move']
            }
        })
    }

    processForces() {
        // synchronizing dummy position
        const entity = this.entity;
        const dummy = entity.dummy;
        const f = dummy.force;
        this.slide(f);
        dummy.position.set(entity.position.x, entity.position.y);
    }


    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    $init() {
        this.engine.smasher.registerEntity(this.entity);
        this.processForces();
    }

    $move() {
        super.$move();
        this.processForces();
    }
}

export default TangibleThinker;