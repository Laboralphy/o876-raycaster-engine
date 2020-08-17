import MoverThinker from "libs/engine/thinkers/MoverThinker";
import * as RC_CONSTS from "libs/raycaster/consts";
import Easing from "libs/easing";
import * as CONSTS from "../consts";
import Geometry from "libs/geometry";

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

    set target(value) {
        this._target = value;
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

    updateSightData() {
        const entity = this.entity;
        if (!('sight' in entity.data)) {
            entity.data.sight = {
                visible: false,
                captureFactor: 0,
                distance: 0,
            };
        }
        const nScrWidth = this.engine.raycaster.renderCanvas.width >> 1;
        const data = entity.data.sight;
        const aVisibleSectors = this.engine.raycaster.visibleCells;
        const bVisible = data.visible = !!entity.sector && aVisibleSectors.isMarked(entity.sector.x, entity.sector.y);
        const oPlayerPos = this.target.position;
        const oGhostPos = entity.position;
        data.distance = Geometry.distance(oPlayerPos.x, oPlayerPos.y, oGhostPos.x, oGhostPos.y);
        if (bVisible) {
            const r = entity.sprite.lastRendered;
            const fGhostPos = Math.abs(r.dx + (r.dw / 2) - nScrWidth);
            const fCaptSize = this.context.game.logic.prop('getCameraCaptureRadius')
                * CONSTS.CAMERA_CIRCLE_SIZE
                * nScrWidth;
            data.captureFactor = Math.max(0, 1 - fGhostPos / fCaptSize);
        } else {
            data.captureFactor = 0;
        }
    }
}


export default GhostThinker;