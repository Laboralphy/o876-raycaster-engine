import Easing from "../../src/libs/easing/Easing";
import TangibleThinker from "../../src/libs/engine/thinkers/TangibleThinker";
import * as CONSTS from "../../src/libs/engine/consts";

const ANGLE_INT_MAX_TIME = 666;
const ANGLE_INT_MIN_VALUE = 0.0;
const ANGLE_INT_MAX_VALUE = 0.1;
const SPEED = 6;

class DevKbdThinker extends TangibleThinker {

    constructor() {
        super();
        this.dummy.tangibility.self = CONSTS.COLLISION_CHANNEL_CREATURE;
        this._easing = new Easing();
        this._easing.setFunction(Easing.LINEAR);
        this._easing.setStepCount(ANGLE_INT_MAX_TIME);
        this._easing.setOutputRange(ANGLE_INT_MIN_VALUE, ANGLE_INT_MAX_VALUE);
            this._keys = {
            up: false,
            down: false,
            right: false,
            left: false
        };

        this._lastTime = 0;
    }

    keyDown(key) {
        const k = this._keys;
        switch (key) {
            case 'ArrowUp':
                if (!k.up) {
                    k.up = this._lastTime;
                }
                break;

            case 'ArrowDown':
                if (!k.down) {
                    k.down = this._lastTime;
                }
                break;

            case 'ArrowLeft':
                if (!k.left) {
                    k.left = this._lastTime;
                }
                break;

            case 'ArrowRight':
                if (!k.right) {
                    k.right = this._lastTime;
                }
                break;

            case ' ':
                this._keys.use = true;
                break;
        }
    }

    keyUp(key) {
        switch (key) {
            case 'ArrowUp':
                this._keys.up = false;
                break;

            case 'ArrowDown':
                this._keys.down = false;
                break;

            case 'ArrowLeft':
                this._keys.left = false;
                break;

            case 'ArrowRight':
                this._keys.right = false;
                break;

            case ' ':
                this._keys.use = false;
                break;
        }
    }

    computeAngleSpeed(nTime) {
        if (nTime > ANGLE_INT_MAX_TIME) {
            return ANGLE_INT_MAX_VALUE;
        } else {
            return this._easing.compute(nTime).y;
        }
    }

    computeSpeedVector() {
        const entity = this.entity;
        const engine = this.engine;
        const t = this._lastTime = engine.getTime();
        const k = this._keys;
        const rc = engine.raycaster;
        const ps = rc.options.metrics.spacing;
        const oEntLoc = this.entity.position;

        const forw = (k.up !== false ? 'f' : '') + (k.down !== false ? 'b' : '');
        switch (forw) {
            case 'f':
                this.setSpeed(
                    SPEED * Math.cos(oEntLoc.angle),
                    SPEED * Math.sin(oEntLoc.angle)
                );
                break;

            case 'b':
                this.setSpeed(
                    -SPEED * Math.cos(oEntLoc.angle),
                    -SPEED * Math.sin(oEntLoc.angle)
                );
                break;

            case '':
            case 'fb':
                // no move
                this.setSpeed(0, 0);
                break;
        }

        if (k.right !== false) {
            oEntLoc.angle += this.computeAngleSpeed(t - k.right);
        }
        if (k.left !== false) {
            oEntLoc.angle -= this.computeAngleSpeed(t - k.left);
        }

        if (k.use) {
            k.use = false;
            const vFront = entity.position.front(ps);
            vFront.x = vFront.x / ps | 0;
            vFront.y = vFront.y / ps | 0;
            engine.openDoor(vFront.x, vFront.y, true);
        }
    }

    s_move() {
        this.computeSpeedVector();
        super.s_move();
    }
}

export default DevKbdThinker;