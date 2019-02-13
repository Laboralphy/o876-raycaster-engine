import Easing from "../../easing";
import TangibleThinker from "./TangibleThinker";
import * as CONSTS from "../consts";

const ANGLE_INT_MAX_TIME = 666;
const ANGLE_INT_MIN_VALUE = 0.0;
const ANGLE_INT_MAX_VALUE = 0.1;
const SPEED = 6;

class KeyboardControlThinker extends TangibleThinker {

    constructor() {
        super();
        this.dummy.tangibility.self = CONSTS.COLLISION_CHANNEL_CREATURE;
        this._easing = new Easing();
        this._easing.setFunction(Easing.LINEAR);
        this._easing.setStepCount(ANGLE_INT_MAX_TIME);
        this._easing.setOutputRange(ANGLE_INT_MIN_VALUE, ANGLE_INT_MAX_VALUE);
        this._keys = {};
        this.SPEED = SPEED;
        this.setupKeys({
            "forward": "ArrowUp",
            "backward": "ArrowDown",
            "steerright": "ArrowRight",
            "steerleft": "ArrowLeft",
            "use": " "
        });

        this._lastTime = 0;
        window.addEventListener('keydown', event => this.keyDown(event.key));
        window.addEventListener('keyup', event => this.keyUp(event.key));
    }

    setupKeys(oKeys) {
        for (let sKey in oKeys) {
            this._keys[sKey] = {
                code: oKeys[sKey],
                state: false
            };
        }
    }

    getKey(key) {
        const k = this._keys;
        for (let sKey in k) {
            const ik = k[sKey];
            if (ik.code === key) {
                return ik;
            }
        }
        return null;
    }

    keyDown(key) {
        const k = this.getKey(key);
        if (k !== null && k.state === false) {
            k.state = this._lastTime;
        }
    }

    keyUp(key) {
        const k = this.getKey(key);
        if (k !== null) {
            k.state = false;
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
        const oEntLoc = this.entity.location;

        const forw = (k.forward.state !== false ? 1 : 0) | (k.backward.state !== false ? 2 : 0);
        switch (forw) {
            case 1:
                this.setSpeed(
                    this.SPEED * Math.cos(oEntLoc.angle),
                    this.SPEED * Math.sin(oEntLoc.angle)
                );
                break;

            case 2:
                this.setSpeed(
                    -this.SPEED * Math.cos(oEntLoc.angle),
                    -this.SPEED * Math.sin(oEntLoc.angle)
                );
                break;

            case 0:
            case 3:
                // no move
                this.setSpeed(0, 0);
                break;
        }

        if (k.steerright.state !== false) {
            oEntLoc.angle += this.computeAngleSpeed(t - k.steerright.state);
        }
        if (k.steerleft.state !== false) {
            oEntLoc.angle -= this.computeAngleSpeed(t - k.steerleft.state);
        }

        if (k.use.state !== false) {
            k.use.state = false;
            const vFront = entity.location.front(CONSTS.METRIC_PUSH_DISTANCE);
            vFront.x = vFront.x / ps | 0;
            vFront.y = vFront.y / ps | 0;
            engine.pushBlock(entity, vFront.x, vFront.y);
        }
    }

    $move() {
        this.computeSpeedVector();
        super.$move();
    }
}

export default KeyboardControlThinker;