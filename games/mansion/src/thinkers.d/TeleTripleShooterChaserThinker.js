import VengefulThinker from "./VengefulThinker";
const THINKER_DISTANCE_TELEPORT_BEHIND = 256; // distance à laquel le ghost va téléporter

/**
 * Le fantome se déplace au hasard et tire en se téléportant
 *
 * Testé le 2023-03-16
 */
class TeleShooterChaserThinker extends VengefulThinker {

    constructor() {
        super();
        this.ghostAI.defineStates({
            init: {
                // Suit la cible sans se téléporter pendant 5 s
                loop: ['$followTarget'],
                jump: [{
                    test: '$elapsedTime 3000',
                    state: 'mayTeleport'
                }]
            },
            mayTeleport: {
                // Suit la cible, mais peut se téléporter si proche
                loop: ['$followTarget'],
                done: ['$stop'],
                jump: [{
                    test: '$isTargetCloserThan 256',
                    state: 'pauseBeforeTeleport'
                }]
            },
            pauseBeforeTeleport: {
                init: ['$unwound', '$shutterChance 1'],
                done: ['$shutterChance 0'],
                jump: [{
                    test: '$isWoundedCritical',
                    state: 'init'
                }, {
                    test: '$elapsedTime 500',
                    state: 'teleport'
                }]
            },
            teleport: {
                done: ['$teleportBehindTarget'],
                jump: [{
                    state: 'shootWhenTeleportDone'
                }]
            },
            shootWhenTeleportDone: {
                jump: [{
                    test: '$isTeleportAnimDone',
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

export default TeleShooterChaserThinker
