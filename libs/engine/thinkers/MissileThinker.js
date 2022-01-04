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
        this._speedNorm = 0;
        this._bCrashWall = true;
        this._victims = []; // list of entities that have been hit
        this.defineTransistions({
            "s_init": [
                [1, "s_firing"]
            ],
            "s_firing": [
                ["t_outofowner", "s_solid", "s_move"]
            ],
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
        this.automaton.state = "s_init";
    }

    fire(owner, speed) {
        // sets the owner
        this._owner = owner;

        // prepare data
        const oOwnerLocation = owner.position;
        const missile = this.entity;
        const dummy = missile.dummy;

        // define tangibility
        dummy.tangibility.self = CONSTS.COLLISION_CHANNEL_MISSILE;
        dummy.tangibility.hitmask = 0;

        // synchronize position
        missile.position.set(oOwnerLocation);

        // set proper speed vector
        this._speedNorm = speed;
        this.setAngle(oOwnerLocation.angle)
    }

    setAngle (a) {
        this.entity.position.angle = a
        const {dx, dy} = Geometry.polar2rect(a, this._speedNorm);
        this.setSpeed(dx, dy);
    }


    /**
     * retrieve a list of dummies that collides with this entity
     * does not include owner
     * @returns {Dummy[]}
     */
    getCollidingEntities() {
        const aEntities = this.entity.dummy.smashers;
        if (!!aEntities && aEntities.length > 0) {
            // expel owner from colliding dummies list
            const nOwnerIndex = aEntities.indexOf(this._owner);
            if (nOwnerIndex >= 0) {
                aEntities.splice(nOwnerIndex, 1);
            }
        }
        return aEntities;
    }

    ////// STATES ///// STATES ///// STATES ///// STATES ///// STATES ///// STATES ///// STATES ///// STATES /////
    ////// STATES ///// STATES ///// STATES ///// STATES ///// STATES ///// STATES ///// STATES ///// STATES /////
    ////// STATES ///// STATES ///// STATES ///// STATES ///// STATES ///// STATES ///// STATES ///// STATES /////

    // the missile is firing,
    // has just spawned be still colliding with owner
    s_firing() {
        this.s_move();
    }

    // the missile is not colliding with owner :
    // the missile becomes solid and will hit any other entity.
    s_solid() {
        this.entity.dummy.tangibility.hitmask = CONSTS.COLLISION_CHANNEL_CREATURE;
    }

    // The missile has hit something
    s_dead() {
        this.entity.dead = true;
    }



    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////

    // true if missile is not colliding owner
    t_outofowner() {
        // calculer la distance entre owner et missile
        const m = this.entity;
        const o = this._owner;
        const mpos = m.position;
        const opos = o.position;
        return Geometry.distance(mpos.x, mpos.y, opos.x, opos.y) > (o.size + m.size);
    }

    /**
     * returns true if this entity hits something (wall or other entity)
     * @return {boolean}
     */
    t_hitSomething() {
        const bHitWall = !!this._cwc.wcf.c;
        const aHitters = this.getCollidingEntities();
        const bHitThing = !!aHitters && aHitters.length > 0;
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