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
                done: ['$shoot'],
                jump: [{
                    test: '$isTeleportAnimDone',
                    state: 'init'
                }]
            }
        })
    }
}

export default TeleShooterChaserThinker
