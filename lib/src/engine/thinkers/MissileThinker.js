import TangibleThinker from "./TangibleThinker";
import GeometryHelper from "../../geometry/GeometryHelper";
import * as CONSTS from "../consts";

/**
 * This thinker is specialized for missile entities
 * it typically has an owner, an entity that fired the missile.
 */
class MissileThinker extends TangibleThinker {
    constructor() {
        super();
        this._owner = null;
        this._bCrashWall = true;
        this._victims = []; // list of entities that have been hit
    }

    get victims() {
        return this._victims;
    }

    fire(owner, speed) {
        // sets the owner
        this._owner = owner;

        // prepare data
        const oOwnerLocation = owner.location;
        const missile = this.entity;
        const dummy = this.dummy;
        const engine = this.engine;

        // define tangibility
        dummy.tangibility.self = CONSTS.COLLISION_CHANNEL_MISSILE;
        dummy.tangibility.hitmask = CONSTS.COLLISION_CHANNEL_CREATURE;

        // synchronize location
        missile.location.set(oOwnerLocation);

        // updateDummy missile on the collider
        engine._collider.updateDummy(dummy);

        // set proper speed vector
        const {dx, dy} = GeometryHelper.polar2rect(oOwnerLocation.angle, speed);
        this.setSpeed(dx, dy);
    }


    /**
     * retrieve a list of dummies that collides with this entity
     * does not include owner
     * @returns {Dummy[]}
     */
    getCollidingDummies() {
        const aDummies = this.engine._collider.getCollidingDummies(this._dummy);
        if (aDummies.length > 0) {
            // expel owner from colliding dummies list
            const owner = this._owner;
            const ownerDummy = owner.thinker.dummy;
            const nOwnerIndex = aDummies.indexOf(ownerDummy);
            if (nOwnerIndex >= 0) {
                aDummies.splice(nOwnerIndex, 1);
            }
        }
        return aDummies
    }

    $move() {
        super.$move();
        const wcf = this._cwc.wcf;
        // check entities
        this._victims = this.getCollidingDummies();
        // check walls
        if (this._victims.length > 0 || (wcf.c)) {
            // a wall is hit
            this.state = 'explode';
        }
    }

    $explode() {
        // list of hit entities is "this._victims"
        if (this.entity.sprite.getCurrentAnimation().frozen) {
            this.state = 'dead';
        }
    }

    $dead() {
        this.entity.dead = true;
        this.state = 'idle';
    }
}

export default MissileThinker;