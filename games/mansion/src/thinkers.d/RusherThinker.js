import VengefulThinker from "./VengefulThinker";

const THINKER_DISTANCE_RUSH = 256; // distance à laquel le ghost va rusher

/**
 * Chase target directly.
 * When close enough to target, rushes at constant angle... must be avoided.
 *
 * testé le 2023-03-15
 */
class RusherThinker extends VengefulThinker {
    constructor() {
        super();
        this.ghostAI.defineStates({
            init: {
                loop: ['$followTarget'],
                jump: [{
                    test: '$elapsedTime 3000',
                    state: 'chase'
                }]
            },
            chase: {
                loop: ['$followTarget'],
                jump: [{
                    test: '$isTargetCloserThan 256',
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
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    $rush() {
        // define rush vector
        this.moveTowardTarget(4, 0);
    }

    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////

    /**
     * returns true if this entity hits something (wall or other entity)
     * @return {boolean}
     */
    $hitWall() {
        return !!this._cwc.wcf.c;
    }
}

export default RusherThinker;
