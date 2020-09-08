import TangibleThinker from "./TangibleThinker";
import Geometry from "../../geometry";
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
        this.defineTransistions({
            "s_move": [
                ["t_hitSomething", "s_hit"]
            ],
            "s_hit": [
                [1,  "s_explode"]
            ],
            "s_explode": [
                ["t_explosionFinished", "s_dead"]
            ],
            "s_dead": [
                [1, "s_idle"]
            ]
        });
    }

    get victims() {
        return this._victims;
    }

    fire(owner, speed) {
        // sets the owner
        this._owner = owner;

        // prepare data
        const oOwnerLocation = owner.position;
        const missile = this.entity;
        const dummy = this.dummy;
        const engine = this.engine;

        // define tangibility
        dummy.tangibility.self = CONSTS.COLLISION_CHANNEL_MISSILE;
        dummy.tangibility.hitmask = CONSTS.COLLISION_CHANNEL_CREATURE;

        // synchronize position
        missile.position.set(oOwnerLocation);

        // updateDummy missile on the collider
        engine._collider.updateDummy(dummy);

        // set proper speed vector
        const {dx, dy} = Geometry.polar2rect(oOwnerLocation.angle, speed);
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
        return aDummies;
    }

    ////// STATES ///// STATES ///// STATES ///// STATES ///// STATES ///// STATES ///// STATES ///// STATES /////
    ////// STATES ///// STATES ///// STATES ///// STATES ///// STATES ///// STATES ///// STATES ///// STATES /////
    ////// STATES ///// STATES ///// STATES ///// STATES ///// STATES ///// STATES ///// STATES ///// STATES /////

    s_dead() {
        this.entity.dead = true;
    }



    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////

    /**
     * returns true if this entity hits something (wall or other entity)
     * @return {boolean}
     */
    t_hitSomething() {
        const bHitWall = !!this._cwc.wcf.c;
        const bHitThing = this.getCollidingDummies().length > 0;
        return bHitThing || bHitWall;
    }

    /**
     * returns true if the current sprite animation is finished
     * @return {boolean}
     */
    t_explosionFinished() {
        return this.entity.sprite.getCurrentAnimation().frozen;
    }
}

export default MissileThinker;