import VengefulThinker from "./VengefulThinker";

const THINKER_ZIGZAG_PULSE = 8;
const THINKER_ZIGZAG_CLOSE_RANGE = 96;
const THINKER_ZIGZAG_SECURITY_RANGE = 64;

/**
 * Le fantome ne fait que suivre bêtement le target
 *
 * testé : le 2023-03-16
 */
class ZigZagTeleChaserThinker extends VengefulThinker {

    constructor() {
        super();
        this.ghostAI.defineStates({
            init: {
                loop: ['$zigzag'],
                jump: [{
                    test: '$isTargetCloserThan 200',
                    state: 'pauseBeforeTeleport'
                }]
            },
            pauseBeforeTeleport: {
                init: ['$stop', '$shutterChance 1'],
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
                    state: 'chaseWhenTeleportDone'
                }]
            },
            chaseWhenTeleportDone: {
                jump: [{
                    test: '$isTeleportAnimDone',
                    state: 'chase'
                }]
            },
            chase: {
                loop: ['$followTarget'],
                jump: [{
                    test: '$isTargetFurtherThan 220',
                    state: 'init'
                }]
            }
        })
        this._zigzagTime = 0;
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    $zigzag() {
        ++this._zigzagTime;
        const a = -(Math.PI / 4) * Math.cos(Math.PI * this._zigzagTime / THINKER_ZIGZAG_PULSE);
        this.moveTowardTarget(1, a)
    }
}

export default ZigZagTeleChaserThinker;
