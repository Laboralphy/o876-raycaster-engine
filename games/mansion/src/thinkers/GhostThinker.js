import MoverThinker from "libs/engine/thinkers/MoverThinker";
import * as RC_CONSTS from "libs/raycaster/consts";
import Easing from "libs/easing";

class GhostThinker extends MoverThinker {

    constructor() {
        super();
        this._nOpacity = 0; // indice de transparence 0 = invisible, 1 = 25% alpha ... 4 = 100% opacity
        this._nTime = 0;
        this._nTimeOut = 0;
        this._target = null; // cible designée
    }

    get target() {
        return this._target;
    }

    /**
     * Sets sprites flag according to opacity level
     */
    setOpacityFlags() {
        const sprite = this.entity.sprite;
        switch (this._nOpacity) {
            case 0:
                sprite.removeFlag(RC_CONSTS.FX_ALPHA_25 | RC_CONSTS.FX_ALPHA_50 | RC_CONSTS.FX_ALPHA_75);
                sprite.visible = false;
                break;

            case 1:
                sprite.removeFlag(RC_CONSTS.FX_ALPHA_50 | RC_CONSTS.FX_ALPHA_75);
                sprite.visible = true;
                sprite.addFlag(RC_CONSTS.FX_ALPHA_25);
                break;

            case 2:
                sprite.removeFlag(RC_CONSTS.FX_ALPHA_25 | RC_CONSTS.FX_ALPHA_75);
                sprite.visible = true;
                sprite.addFlag(RC_CONSTS.FX_ALPHA_50);
                break;

            case 3:
                sprite.removeFlag(RC_CONSTS.FX_ALPHA_25 | RC_CONSTS.FX_ALPHA_50);
                sprite.visible = true;
                sprite.addFlag(RC_CONSTS.FX_ALPHA_75);
                break;

            case 4:
                sprite.removeFlag(RC_CONSTS.FX_ALPHA_25 | RC_CONSTS.FX_ALPHA_50 | RC_CONSTS.FX_ALPHA_75);
                sprite.visible = true;
                break;
        }
    }


    /**
     * makes the ghost pulse
     */
    pulse() {
        ++this._nTime;
        this._nOpacity = (this._nTime & 1) + 3;
        this.setOpacityFlags();
    }

    vectorToTarget() {
        const oGhost = this.entity;
        const oTarget = this.target;
        const vGhostPos = oGhost.position;
        const vTargetPos = oTarget.position;
        return vTargetPos.vector().sub(vGhostPos.vector());
    }

    /**
     * sets the moving angle, so the ghost may chase the target
     */
    lookAtTarget() {
        this.entity.position.angle = this.vectorToTarget().angle();
    }

    /**
     * get the distance beetwen target and ghost
     */
    getDistanceToTarget() {
        return this.vectorToTarget().length();
    }

    moveForward() {
        const oGhostPos = this.entity.position;
        oGhostPos.set(oGhostPos.front(this._speed));
    }

    setTimeOut(n) {
        this._nTimeOut = this.engine.getTime() + n;
    }
}


export default GhostThinker;