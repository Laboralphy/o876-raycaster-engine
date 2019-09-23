import Easing from "../../easing";
import TangibleThinker from "./TangibleThinker";
import * as CONSTS from "../consts";
import Vector from "../../geometry/Vector";

const ANGLE_INT_MAX_TIME = 666;
const ANGLE_INT_MIN_VALUE = 0.0;
const ANGLE_INT_MAX_VALUE = 0.1;
const SPEED = 6;
const STRAFE_SPEED = 0.8;

class FPSControlThinker extends TangibleThinker {

    constructor() {
        super();
        this.dummy.tangibility.self = CONSTS.COLLISION_CHANNEL_CREATURE;
        this._easing = new Easing();
        this._easing.setFunction(Easing.LINEAR);
        this._easing.setStepCount(ANGLE_INT_MAX_TIME);
        this._easing.setOutputRange(ANGLE_INT_MIN_VALUE, ANGLE_INT_MAX_VALUE);
        this._commands = {};
        this.SPEED = SPEED;
        this.setupCommands({
            forward: ["ArrowUp", "w", "z"],       // going forward
            backward: ["ArrowDown", "s"],         // going backward
            turnright: "ArrowRight",              // turn right
            turnleft: "ArrowLeft",                // turn left
            straferight: ["a", "q"],              // side step to the right, looking angle does not change
            strafeleft: "d",                      // side step to the left, looking angle does not change
            use: " "                              // use something in front of...
        });
        this._lookAmount = 0;
        this._lastTime = 0;
        this._lookFactor = 0.01;
    }

    /**
     * checks if command is "on" : player has push matching button
     * @param sCommand {string} name of command (formward, use ...)
     * @return {boolean} true = command is pushed
     */
    isCommandOn(sCommand) {
        return this._commands[sCommand].state !== false;
    }

    /**
     * clears command state. acknowledging command processed
     * @param sCommand {string} command name
     */
    clearCommand(sCommand) {
        this._commands[sCommand].state = false;
    }

    setLookFactor(f) {
        this._lookFactor = f;
    }

    setupCommands(oKeys, bReset = false) {
        if (bReset) {
            this._commands = {};
        }
        for (let sKey in oKeys) {
            this._commands[sKey] = {
                code: Array.isArray(oKeys[sKey]) ? oKeys[sKey] : [oKeys[sKey]],
                state: false
            };
        }
    }

    getKey(key) {
        const k = this._commands;
        for (let sKey in k) {
            const ik = k[sKey];
            if (ik.code.indexOf(key) >= 0) {
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

    look(x) {
        this._lookAmount += x * this._lookFactor;
    }

    computeAngleSpeed(nTime) {
        if (nTime > ANGLE_INT_MAX_TIME) {
            return ANGLE_INT_MAX_VALUE;
        } else {
            return this._easing.compute(nTime).y;
        }
    }

    /**
     * Compute forward vector
     * @param fAngle
     * @return {Vector}
     */
    getVectorForward(fAngle, fSpeed) {
        return new Vector(
            fSpeed * Math.cos(fAngle),
            fSpeed * Math.sin(fAngle)
        );
    }

    getVectorBackward(fAngle, fSpeed) {
        return this.getVectorForward(fAngle + Math.PI, fSpeed);
    }

    getVectorLeftward(fAngle, fSpeed) {
        return this.getVectorForward(fAngle + Math.PI / 2, fSpeed);
    }

    getVectorRightward(fAngle, fSpeed) {
        return this.getVectorForward(fAngle - Math.PI / 2, fSpeed);
    }

    computeSpeedVector() {
        const entity = this.entity;
        const engine = this.engine;
        const t = this._lastTime = engine.getTime();
        const k = this._commands;
        const rc = engine.raycaster;
        const ps = rc.options.metrics.spacing;
        const oEntLoc = this.entity.location;
        const PI = Math.PI;
        const PI2 = Math.PI / 2;
        const PI4 = Math.PI / 4;

        if (k.turnright.state !== false) {
            oEntLoc.angle += this.computeAngleSpeed(t - k.turnright.state);
        }
        if (k.turnleft.state !== false) {
            oEntLoc.angle -= this.computeAngleSpeed(t - k.turnleft.state);
        }

        oEntLoc.angle += this._lookAmount;
        this._lookAmount = 0;

        const nDirMask =
            (k.forward.state !== false ? 1 : 0) |
            (k.backward.state !== false ? 2 : 0) |
            (k.strafeleft.state !== false ? 4 : 0) |
            (k.straferight.state !== false ? 8 : 0)
        ;

        let fAngleQuant = oEntLoc.angle;
        let speed = this.SPEED;

        switch (nDirMask) {
            case 1: // forward only
            case 13: // straferight and strafeleft and forward
                // result : FORWARD
                this.setSpeed(this.getVectorForward(fAngleQuant, speed));
                break;

            case 2: // backward only
            case 14: // straferight and strafeleft and backward
                // result : BACKWARD
                this.setSpeed(this.getVectorBackward(fAngleQuant, speed));
                break;

            case 0: // nothing
            case 3: // forward and backward
            case 12: // straferight and strafeleft
            case 15: // straferight and strafeleft and forward and backward
                // result : NO MOVE
                this.setSpeed(Vector.zero());
                break;

            case 4: // strafeleft only
            case 7: // strafeleft and forward and backward
                // result : FULL LEFT
                this.setSpeed(this.getVectorLeftward(fAngleQuant, STRAFE_SPEED * speed));
                break;

            case 8: // straferight only
            case 11: // straferight and forward and backward
                // result : FULL RIGHT
                this.setSpeed(this.getVectorRightward(fAngleQuant, STRAFE_SPEED * speed));
                break;

            case 5: // strafeleft and forward
                // result : DIAG FORWARD+LEFT
                this.setSpeed(
                    this.getVectorForward(fAngleQuant, speed)
                        .add(this.getVectorLeftward(fAngleQuant, STRAFE_SPEED * speed))
                );
                break;

            case 6: // strafeleft and backward
                // result : DIAG BACKWARD+LEFT
                this.setSpeed(
                    this.getVectorBackward(fAngleQuant, speed)
                        .add(this.getVectorLeftward(fAngleQuant, STRAFE_SPEED * speed))
                );
                break;

            case 9: // straferight and forward
                // result : DIAG FORWARD+RIGHT
                this.setSpeed(
                    this.getVectorForward(fAngleQuant, speed)
                        .add(this.getVectorRightward(fAngleQuant, STRAFE_SPEED * speed))
                );
                break;

            case 10: // straferight and backward
                // result : DIAG BACKWARD+RIGHT
                this.setSpeed(
                    this.getVectorBackward(fAngleQuant, speed)
                        .add(this.getVectorRightward(fAngleQuant, STRAFE_SPEED * speed))
                );
                break;
        }

        if (k.use.state !== false) {
            k.use.state = false;
            const vFront = entity.location.front(CONSTS.METRIC_PUSH_DISTANCE);
            vFront.x = vFront.x / ps | 0;
            vFront.y = vFront.y / ps | 0;
            this.useBlock(vFront.x, vFront.y);
        }
    }

    /**
     * Default behavior for pushing blocks
     * @param x
     * @param y
     */
    useBlock(x, y) {
        this.engine.pushBlock(this.entity, x, y);
    }



    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    s_move() {
        this.computeSpeedVector();
        super.s_move();
    }
}

export default FPSControlThinker;