import VengefulThinker from "./VengefulThinker";

/**
 * 1) Le fantôme se dirige en ligne droite vers sa cible, pendant 3 secondes, si la cible se déplace, le fantôme
 * ne corrige pas sa trajectoire
 *
 * 2) le fantome s'arrete pendant 0.75 seconde et un shutter chance est allumé
 *
 * 3) le fantôme tire un projectile vers le joueur
 *
 * 4) le fantôme va en 1)
 *
 * testé le 2023-03-15
 */
class ShooterWalkerThinker extends VengefulThinker {

    constructor() {
        super();
        this.ghostAI.defineStates({
            init: {
                init: ['$followTarget'],
                jump: [{
                    test: '$elapsedTime 3000',
                    state: 'pauseBeforeShoot'
                }]
            },
            pauseBeforeShoot: {
                init: ['$stop', '$shutterChance 1'],
                done: ['$shutterChance 0'],
                jump: [{
                    test: '$isWoundedCritical',
                    state: 'init'
                }, {
                    test: '$elapsedTime 750',
                    state: 'shoot'
                }]
            },
            shoot: {
                init: ['$shoot'],
                jump: [{
                    test: '$elapsedTime 1000',
                    state: 'init'
                }]
            }
        })
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    $shoot() {
        this.moveTowardTarget(0, 0);
        // tirer un projectile
        const oMissileData = Array.isArray(this.entity.data.missile)
            ? this.entity.data.missile[Math.floor(Math.random() * this.entity.data.missile.length)]
            : this.entity.data.missile
        const sMissileResRef = oMissileData.resref
        const missile = this.engine.createEntity(sMissileResRef, this.entity.position);
        missile.thinker.fire(this.entity, oMissileData);
    }
}

export default ShooterWalkerThinker
