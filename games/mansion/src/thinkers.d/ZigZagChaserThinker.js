import VengefulThinker from "./VengefulThinker";

const THINKER_ZIGZAG_PULSE = 8;
const THINKER_ZIGZAG_CLOSE_RANGE = 96;
const THINKER_ZIGZAG_SECURITY_RANGE = 64;

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
                    state: 'chase'
                }]
            },
            chase: {
                loop: ['$followTarget'],
                jump: [{
                    test: '$isTargetFurtherThan 160',
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

export default ZigZagChaserThinker;
