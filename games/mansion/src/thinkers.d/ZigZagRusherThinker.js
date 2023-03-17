import VengefulThinker from "./VengefulThinker";

const THINKER_ZIGZAG_PULSE = 8;

/**
 * Le fantome ne fait que suivre bêtement le target
 *
 * testé : le 2023-03-16
 */
class ZigZagChaserThinker extends VengefulThinker {

    constructor() {
        super();
        this.ghostAI.defineStates({
            init: {
                loop: ['$zigzag'],
                jump: [{
                    test: '$isTargetCloserThan 96',
                    state: 'pauseBeforeRush'
                }]
            },
            pauseBeforeRush: {
                init: ['$stop', '$shutterChance 1'],
                done: ['$shutterChance 0'],
                jump: [{
                    test: '$isWoundedCritical',
                    state: 'init'
                }, {
                    test: '$elapsedTime 750',
                    state: 'rush'
                }]
            },
            rush: {
                init: ['$rush'],
                done: ['$stop'],
                jump: [{
                    test: '$hitWall',
                    state: 'init'
                }, {
                    test: '$isTargetHit',
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

    $rush() {
        // define rush vector
        this.moveTowardTarget(4, 0);
    }
}

export default ZigZagChaserThinker;
