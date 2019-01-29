import Thinker from "../../src/engine/thinkers/Thinker";
import Easing from "../../src/easing/Easing";
import Vector from "../../src/geometry/Vector";

const ANGLE_INT_MAX_TIME = 666;
const ANGLE_INT_MIN_VALUE = 0.0;
const ANGLE_INT_MAX_VALUE = 0.1;
const SPEED = 6;

class DevKbd extends Thinker {

    constructor() {
        super();
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
        this.state = 'letsMove';
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

    $letsMove() {
        const entity = this.entity;
        const engine = this.engine;
        const t = this._lastTime = engine.getTime();
        const k = this._keys;
        const eloc = entity.location;
        const rc = engine.raycaster;
        const ps = rc.options.metrics.spacing;

        if (k.up !== false) {
            this.slide(new Vector(
                SPEED * Math.cos(eloc.angle),
                SPEED * Math.sin(eloc.angle),
            ));
        }
        if (k.down !== false) {
            this.slide(new Vector(
                -SPEED * Math.cos(eloc.angle),
                -SPEED * Math.sin(eloc.angle),
            ));
        }
        if (k.right !== false) {
            entity.location.angle += this.computeAngleSpeed(t - k.right);
        }
        if (k.left !== false) {
            entity.location.angle -= this.computeAngleSpeed(t - k.left);
        }

        if (k.use) {
            k.use = false;
            const vFront = entity.location.front(ps);
            vFront.x = vFront.x / ps | 0;
            vFront.y = vFront.y / ps | 0;
            engine.openDoor(vFront.x, vFront.y, true);
        }
    }
}

export default DevKbd;