import MoverThinker from "../../../lib/src/engine/thinkers/MoverThinker";
import * as RC_CONSTS from "../../../lib/src/raycaster/consts";




class VengefulThinker extends MoverThinker {

    constructor() {
        super();
        this._nOpacity = 0; // indice de transparence 0 = invisible, 1 = 25% alpha ... 4 = 100% opacity
        this._nTime = 0;
        this.transitions = {
            "s_spawn": {
                "1": "s_spawning"
            },
            "s_spawning": {
                "t_fullOpacity": "s_idle"
            }
        }
    }

    /**
     * Sets sprites flag according to opacity level
     */
    setSpriteFXFlags() {
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
                sprite.visible = false;
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
        this.setSpriteFXFlags();
    }



    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    /**
     * The ghost just as spawned, still invisible
     */
    s_spawn() {
        this._nOpacity = 0;
        this.setSpriteFXFlags();
    }

    /**
     * The ghost is spawning, the alpha prop is increasing
     */
    s_spawning() {
        ++this._nOpacity;
        this.setSpriteFXFlags();
    }

    /**
     * The state of "doing nothing"
     * The ghost is pulsating
     */
    s_idle() {
        this.pulse();
    }



    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////

    /**
     * tests if sprite has reach full opacity
     * @returns {boolean}
     */
    t_fullOpacity() {
        return this._nOpacity >= 4;
    }


}


export default VengefulThinker;