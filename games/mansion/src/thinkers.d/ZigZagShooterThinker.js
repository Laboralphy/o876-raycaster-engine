import VengefulThinker from "./VengefulThinker";

const THINKER_ZIGZAG_PULSE = 8;

/**
 * Le fantome ne fait que suivre bêtement le target
 *
 * testé : le 2023-03-16
 */
class ZigZagShooterThinker extends VengefulThinker {

    constructor() {
        super();
        this.ghostAI.defineStates({
            init: {
                loop: ['$zigzag'],
                jump: [{
                    test: '$elapsedTime 2000',
                    state: 'mayShoot'
                }]
            },
            mayShoot: {
                loop: ['$zigzag'],
                jump: [{
                    test: '$isTargetCloserThan 256',
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
                    test: '$elapsedTime 500',
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

export default ZigZagShooterThinker;
