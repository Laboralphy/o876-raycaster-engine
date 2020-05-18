import MissileThinker from "../../src/libs/engine/thinkers/MissileThinker";
const MISSILE_SPEED = 20;

class MagboltThinker extends MissileThinker {
    fire(owner) {
        const missile = this.entity;
        missile.sprite.setCurrentAnimation('fly');
        super.fire(owner, MISSILE_SPEED);
    }

    s_hit() {
        this.entity.sprite.setCurrentAnimation('explode', 0);
    }
}


export default MagboltThinker;