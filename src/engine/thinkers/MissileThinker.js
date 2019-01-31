import MoverThinker from "./MoverThinker";


/**
 * This thinker is specialized for missile entities
 * it typically has an owner, an entity that fired the missile.
 */
class MissileThinker extends MoverThinker {
    constructor() {
        super();
        this._owner = null;
        this._bCrashWall = true;
        this._victims = []; // list of entities that have been hit
    }

    fire(owner) {
        this._owner = owner;
    }


    /**
     * retrieve a list of dummies that collides with this entity
     * does not include owner
     * @returns {Dummy[]}
     */
    getCollidingDummies() {
        const aDummies = this.engine._collider.getCollidingDummies(this._dummy);
        if (aDummies.length) {
            const owner = this._owner;
            const ownerDummy = owner._dummy;
            const nOwnerIndex = aDummies.indexOf(ownerDummy);
            if (nOwnerIndex >= 0) {
                aDummies.splice(nOwnerIndex, 1);
            }
        }
        return aDummies
    }

    checkVictims() {
        this._victims = this.getCollidingDummies();
    }


    $move() {
        super.$move();
        const wcf = this._cwc.wcf;
        // check walls
        if (wcf.x !== 0 && wcf.y !== 0) {
            // a wall is hit
            this.state = 'explode';
        }
        // check entities
        this.checkVictims();
    }

    $explode() {
        // list of hit entities is "this._victims"
    }
}

export default MissileThinker;