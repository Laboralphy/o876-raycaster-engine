import MissileThinker from "libs/engine/thinkers/MissileThinker";
import Blindness from "../filters/Blindness";
import Timed from "../../../../libs/engine/filters/Timed";
import Confusion from "../filters/Confusion";

const DEFAULT_MISSILE_SPEED = 10
const DEFAULT_MISSILE_EFFECT = 'damage'
const DEFAULT_MISSILE_EFFECT_DURATION = 3000

class LinearBoltThinker extends MissileThinker {
    fire(owner, missileData) {
        this._missileData = missileData
        const missile = this.entity;
        missile.sprite.setCurrentAnimation('fly');
        super.fire(owner, this._missileData.speed || DEFAULT_MISSILE_SPEED);
    }

    applyDamage (entity, nMult = 1) {
        if (nMult > 0) {
            this.context.game.commitGhostAttack(this._owner, entity, nMult)
        }
    }

    applyBlindness (entity) {
        // rechercher s'il existe déja un blindness
        const aPrevBlindFilters = this.engine.filters.filters.filter(f => (f instanceof Timed) && f.child instanceof Blindness)
        aPrevBlindFilters.forEach(f => f.terminate())
        const oBlind = new Blindness()
        const oTime = new Timed({ child: oBlind, duration: this._missileData.duration || DEFAULT_MISSILE_EFFECT_DURATION })
        this.engine.filters.link(oTime)
    }

    applyConfusion (entity) {
        const aPrevConfFilters = this.engine.filters.filters.filter(f => (f instanceof Timed) && f.child instanceof Confusion)
        aPrevConfFilters.forEach(f => f.terminate())
        const oConf = new Confusion()
        const oTime = new Timed({ child: oConf, duration: this._missileData.duration || DEFAULT_MISSILE_EFFECT_DURATION })
        this.engine.filters.link(oTime)
    }

    applyEffect (entity) {
        const sEffect = this._missileData.effect || DEFAULT_MISSILE_EFFECT
        switch (sEffect) {
            case 'damage': {
                this.applyDamage(entity, this._missileData.damage || 1)
                break;
            }

            case 'blindness': {
                this.applyBlindness(entity)
                break;
            }

            case 'confusion': {
                this.applyConfusion(entity)
                break;
            }
        }
    }

    $setExplosionAnimation() {
        this.entity.sprite.setCurrentAnimation('explode', 0);
        const aEntities = this.getCollidingEntities()
        if (Array.isArray(aEntities)) {
            aEntities.forEach(e => {
                this.applyEffect(e)
            })
        }
    }
}

export default LinearBoltThinker;
