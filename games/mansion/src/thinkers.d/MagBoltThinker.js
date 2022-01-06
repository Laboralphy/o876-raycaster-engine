import MissileThinker from "libs/engine/thinkers/MissileThinker";
const MISSILE_SPEED = 10;

class MagBoltThinker extends MissileThinker {
    fire(owner) {
        const missile = this.entity;
        missile.sprite.setCurrentAnimation('fly');
        super.fire(owner, MISSILE_SPEED);
    }

    s_hit() {
        this.entity.sprite.setCurrentAnimation('explode', 0);
        const aEntities = this.getCollidingEntities()
        if (Array.isArray(aEntities) && aEntities.length > 0) {
            // chaque entité subit les effet de ce magbolt
            const owner = this._owner
            aEntities.forEach(e => {
                this.context.game.commitGhostAttack(owner, e)
            })
        }
    }
}


export default MagBoltThinker;
