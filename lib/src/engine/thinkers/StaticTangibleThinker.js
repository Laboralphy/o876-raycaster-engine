import Dummy from "../../collider/Dummy";
import MoverThinker from "./MoverThinker";


/**
 * this thinker is suitable for moving entities that can interact with other tangible entities
 * the collider and force field instances allows this thinker to properly react after any collision
 */
class StaticTangibleThinker extends MoverThinker {
    constructor() {
        super();
        this._dummy = new Dummy();
        this._bUnderForceEffect = false;
    }

    get dummy() {
        return this._dummy;
    }

    syncDummy() {
        // synchronizing dummy position
        const engine = this.engine;
        const entity = this.entity;
        const dummy = this._dummy;
        const location = entity.location;
        const collider = engine._collider;
        dummy.radius = entity.size;
        dummy.position.set(location.x, location.y);
        collider.track(dummy);
    }

    /**
     * retrieve a list of dummies that collides with this entity
     * @returns {Dummy[]}
     */
    getCollidingDummies() {
        return this.engine._collider.getCollidingDummies(this._dummy);
    }

    processForces() {
        // synchronizing dummy position
        const engine = this.engine;
        const dummy = this._dummy;
        const collider = engine._collider;
        const forceField = dummy.forceField;
        this.syncDummy();
        const aHitters = this.getCollidingDummies();
        if (aHitters.length > 0) {
            collider.computeCollidingForces(dummy, aHitters);
        }
        const f = forceField.computeForces();
        if (f.x !== 0 || f.y !==  0) {
            this.slide(f);
            this.changeMovement();
            this._bUnderForceEffect = true;
        } else if (this._bUnderForceEffect) {
            // nous étions toujours sous influence de forces, mais celles ci viennent de retomber à zero
            // indiquer néanmoins les changement un e dernière fois
            this._bUnderForceEffect = false;
            this.changeMovement();
        }
        forceField.reduceForces();
    }


    $move() {
        // this.processForces();
    }
}

export default StaticTangibleThinker;