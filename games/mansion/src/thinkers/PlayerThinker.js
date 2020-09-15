import FPSControlThinker from "libs/engine/thinkers/FPSControlThinker";
import * as CONSTS from "../consts";
import Easing from "libs/easing";

class PlayerThinker extends FPSControlThinker {
    constructor() {
        super();
        this._easingForcedAngle = null;
        this.setupCommands({
            use: [' ', 'Mouse0'],
        });
        this.transitions = {
            ...this.transitions,
            "s_dying": [
                ["t_on_floor", "s_dead"]
            ]
        };

    }


    /**
     * rewrited behavior for pushing blocks
     * @param x
     * @param y
     */
    useBlock(x, y) {
        if (!this.entity.data.camera) {
            // push blocks only if camera is dropped
            this.engine.pushCell(this.entity, x, y);
        }
    }

    setWalkingSpeed(n) {
        this.SPEED = n;
    }

    s_init() {
        super.s_init();
        this.entity.dummy.tangibility.self = CONSTS.TANGIBILITY_PLAYER;
        this.entity.dummy.tangibility.hitmask = CONSTS.TANGIBILITY_GHOST;
        this.engine.smasher.registerEntity(this.entity);
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
        return Math.atan2(pTarget.y - pMe.y, pTarget.x - pMe.x);
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
            super.computeAngleSpeed(nTime);
        }
    }

    think() {
        this.processAngle();
        super.think();
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
        return this.entity.position.z > 1.75;
    }

    s_death() {
    }

    s_dying() {
        if (this.isHeightAtFloorLevel()) {
            this._nDeathZSpeed = 0;
        } else {
            this._nDeathZSpeed += 0.01;
            this.entity.position.z += this._nDeathZSpeed;
        }
    }

    t_on_floor() {
        return this.isHeightAtFloorLevel();
    }
}

export default PlayerThinker;