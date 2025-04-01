import MissileThinker from "libs/engine/thinkers/MissileThinker";
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

    $setExplosionAnimation() {
        this.entity.sprite.setCurrentAnimation('explode', 0);
    }
}


export default MagboltThinker;