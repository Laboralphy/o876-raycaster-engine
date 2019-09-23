import MissileThinker from "../../lib/src/engine/thinkers/MissileThinker";
const MISSILE_SPEED = 20;

class MagboltThinker extends MissileThinker {
    constructor() {
        super();
    }

    fire(owner) {
        const missile = this.entity;
        missile.sprite.setCurrentAnimation('fly');
        super.fire(owner, MISSILE_SPEED);
    }

    s_explode_enter() {
        this.entity.sprite.setCurrentAnimation('explode', 0);
    }
}


export default MagboltThinker;