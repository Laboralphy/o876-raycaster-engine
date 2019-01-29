import MoverThinker from "./MoverThinker";
import Dummy from "../../collider/Dummy";

/**
 * this thinker is suitable for moving entities that can interact with other tangible entities
 * the collider and force field instances allows this thinker to properly react after any collision
 */
class TangibleThinker extends MoverThinker {
    constructor() {
        super();
        this._dummy = new Dummy();
        this._collider = null;
        this._bUnderForceEffect = false;
    }

    processForces() {
        // synchronizing dummy position
        const entity = this.entity;
        const location = entity.location;
        const dummy = this._dummy;
        const collider = this._collider;
        const forceField = dummy.forceField;
        dummy.position.set(location.x, location.y);
        const aHitters = collider.getCollidingDummies(dummy);
        collider.computeCollidingForces(dummy, aHitters);
        const f = forceField.computeForces();
        if (f.x !== 0 || f.y !==  0) {
            this.slide(f);
            this.changeMovement();
            this._bUnderForceEffect = true;
        } else if (this._bUnderForceEffect) {
            // nous étions toujours sous influence de forces, mais celles ci viennent de retomber à zero
            // indiquer néanmoins les changement un e dernière fois
            this._bUnderForceEffect = false;
            this.thinker().changeMovement();
        }
        forceField.reduceForces();
    }

    $move() {
        super.$move();
        this.processForces();
    }
}

export default TangibleThinker;