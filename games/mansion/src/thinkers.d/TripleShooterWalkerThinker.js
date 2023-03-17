import ShooterChaserThinker from "./ShooterWalkerThinker";

/**
 * 1) Le fantôme se dirige en ligne droite vers sa cible, pendant 3 secondes, si la cible se déplace, le fantôme
 * ne corrige pas sa trajectoire
 *
 * 2) le fantome s'arrete pendant 0.75 seconde et un shutter chance est allumé
 *
 * 3) le fantôme tire trois projectiles vers le joueur
 *
 * 4) le fantôme va en 1)
 *
 * Testé le 2023-03-16
 *
 */
class TripleShooterChaserThinker extends ShooterChaserThinker {

    constructor() {
        super();
        this.ghostAI.defineStates({
            init: {
                init: ['$followishTarget'],
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
                    test: '$elapsedTime 750',
                    state: 'quantShoot2'
                }]
            },
            quantShoot2: {
                jump: [{
                    test: '$quantumChoice 50',
                    state: 'init'
                }, {
                    state: 'shoot2'
                }]
            },
            shoot2: {
                init: ['$shoot'],
                jump: [{
                    test: '$elapsedTime 750',
                    state: 'quantShoot3'
                }]
            },
            quantShoot3: {
                jump: [{
                    test: '$quantumChoice 50',
                    state: 'init'
                }, {
                    state: 'shoot3'
                }]
            },
            shoot3: {
                init: ['$shoot'],
                jump: [{
                    state: 'pauseBeforeInit'
                }]
            },
            pauseBeforeInit: {
                init: ['$stop'],
                jump: [{
                    test: '$elapsedTime 750',
                    state: 'init'
                }]
            }
        })
    }

    $followishTarget () {
        this.$followTarget(1, Math.random() - 0.5)
    }
}

export default TripleShooterChaserThinker
