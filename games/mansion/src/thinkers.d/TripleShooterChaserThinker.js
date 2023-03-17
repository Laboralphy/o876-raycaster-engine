import ShooterChaserThinker from "./ShooterChaserThinker";

/**
 * 1) Le fantôme se dirige vers sa cible, pendant 3 secondes, en corrigeant sa trajectoire
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
                // Suivre constament la cible
                loop: ['$followTarget'],
                jump: [{
                    // au bout de 3s on fait une pause avant de tirer
                    test: '$elapsedTime 3000',
                    state: 'pauseBeforeShoot'
                }]
            },
            pauseBeforeShoot: {
                // Pause de 0.75 s avant de tirer
                // shutter chance pendant cet état
                init: ['$stop', '$shutterChance 1'],
                done: ['$shutterChance 0'],
                jump: [{
                    // cadrage fatal pendant la pause : on annule le tir
                    test: '$isWoundedCritical',
                    state: 'init'
                }, {
                    // pause terminée au bout de 0.75s
                    test: '$elapsedTime 750',
                    state: 'shoot'
                }]
            },
            shoot: {
                // Tirer un projectile
                init: ['$shoot'],
                jump: [{
                    // attendre 0.75s
                    test: '$elapsedTime 750',
                    state: 'quantShoot2'
                }]
            },
            quantShoot2: {
                // Décider si on continue de tirer ou si on reprend la course
                jump: [{
                    test: '$quantumChoice 50',
                    state: 'init'
                }, {
                    state: 'shoot2'
                }]
            },
            shoot2: {
                // Tirer un projectile
                init: ['$shoot'],
                jump: [{
                    test: '$elapsedTime 750',
                    state: 'quantShoot3'
                }]
            },
            quantShoot3: {
                // Décider si on continue de tirer ou si on reprend la course
                jump: [{
                    test: '$quantumChoice 50',
                    state: 'init'
                }, {
                    state: 'shoot3'
                }]
            },
            shoot3: {
                // Tirer un projectile
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
}

export default TripleShooterChaserThinker
