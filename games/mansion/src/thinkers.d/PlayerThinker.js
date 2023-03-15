import FPSControlThinker from "libs/engine/thinkers/FPSControlThinker";
import * as CONSTS from "../consts";
import Easing from "libs/easing";
import Geometry from "../../../../libs/geometry";

const Z_FLOOR_LEVEL = 1.75;

class PlayerThinker extends FPSControlThinker {
    constructor() {
        super();
        this._easingForcedAngle = null;
        this.setupCommands({
            use: [' ', 'Mouse0']
        });
        this.automaton.defineStates({
            dying: {
                loop: ['$dyingAnimation'],
                jump: [{
                    test: '$isOnFloor',
                    state: 'dead'
                }]
            }
        })
    }

    /**
     * rewrited behavior for pushing blocks
     * @param x
     * @param y
     */
    useBlock(x, y) {
        if (!this.entity.data.camera) {
            // push blocks only if visor is dropped
            this.engine.pushCell(this.entity, x, y);
        }
    }

    setWalkingSpeed(n) {
        this.SPEED = n;
    }

    $init() {
        super.$init();
        this.entity.dummy.tangibility.self = CONSTS.TANGIBILITY_PLAYER;
        this.entity.dummy.tangibility.hitmask = CONSTS.TANGIBILITY_GHOST;
    }

    /**
     * Un fantome menace.
     * Tourner l'angle de vue vers le fantome
     */
    ghostThreat(oGhost) {
        const fAngle = this.computeAngleToMobile(oGhost);
        this.forceAngle(fAngle);
    }

    /**
     * Compute the angle between The Mobile Heading and another Mobile
     */
    computeAngleToMobile(t) {
        const pMe = this.entity.position;
        const pTarget = t.position;
        // return Math.atan2(pTarget.y - pMe.y, pTarget.x - pMe.x);
        return Geometry.angle(pMe.x, pMe.y, pTarget.x, pTarget.y)
    }

    forceAngle(fTarget) {
        const m = this.entity;
        let fMe = m.position.angle;
        while (fTarget < 0) {
            fTarget += 2 * Math.PI;
            fMe += 2 * Math.PI;
        }
        const fTurn = fMe - fTarget;
        const e = new Easing();
        e.reset().use(Easing.CUBE_DECCEL);
        if (fTurn > Math.PI) {
            e.from(fMe).to(fMe + fTurn).steps(6);
        } else {
            e.from(fMe).to(fMe - fTurn).steps(6);
        }
        this._easingForcedAngle = e;
    }

    processAngle() {
        if (this._easingForcedAngle) {
            this.entity.position.angle = this._easingForcedAngle.compute().y;
            if (this._easingForcedAngle.over()) {
                this._easingForcedAngle = null;
            }
        }
    }

    look(x) {
        if (!this._easingForcedAngle) {
            super.look(x);
        }
    }

    computeAngleSpeed(nTime) {
        if (!this._easingForcedAngle) {
            return super.computeAngleSpeed(nTime);
        } else {
            return 0;
        }
    }

    think() {
        this.processAngle();
        super.think();
        this.context.game._audioManager.setListeningEntity(this.entity.position)
    }

    kill() {
        this.automaton.state = "s_dying";
        this._nDeathZSpeed = 0;
    }

    /**
     * Returns true if the player point of view is at floor level = dead
     * @return boolean
     */
    isHeightAtFloorLevel() {
        return this.entity.position.z > Z_FLOOR_LEVEL;
    }

    $dyingAnimation() {
        if (this.isHeightAtFloorLevel()) {
            this._nDeathZSpeed = 0;
            this.entity.position.z = Z_FLOOR_LEVEL;
        } else {
            this._nDeathZSpeed += 0.005;
            this.entity.position.z += this._nDeathZSpeed;
        }
    }

    $isOnFloor() {
        return this.isHeightAtFloorLevel();
    }
}

export default PlayerThinker;
