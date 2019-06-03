import MissileThinker from "../../src/engine/thinkers/MissileThinker";
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

    $move() {
        super.$move();
    }

    $explode_enter() {
        this.entity.sprite.setCurrentAnimation('explode', 0);
        console.log(this.victims);
    }
}


export default MagboltThinker;