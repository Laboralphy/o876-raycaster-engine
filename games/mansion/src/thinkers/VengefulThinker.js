import GhostThinker from "./GhostThinker";
import * as RC_CONSTS from "libs/raycaster/consts";

class VengefulThinker extends GhostThinker {

    constructor() {
        super();
        this.transitions = {
            "s_spawn": {
                // commencer la phase d'apparition = alpha in
                "1": "s_spawning"
            },
            "s_spawning": {
                // lorsque la full opacity est atteinte ...
                "t_fullOpacity": "s_idle" // passer en idle (customisable selon thinker)
            },
            "s_kill": {
                // lorsque mort -> phase de combustion
                "1": "s_dying"
            },
            "s_dying": {
                // lorsque combustion terminée -> phase de disparition
                "t_doneDying": "s_despawn"
            },
            "s_despawn": {
                // lorsque disparition terminée -> supression entité
                "t_doneFadeOut": "s_dead"
            }
        }
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    /**
     * The ghost just has spawned, still invisible
     */
    s_spawn() {
        this._nOpacity = 0;
        this.entity.sprite.setCurrentAnimation('walk');
        this.setOpacityFlags();
    }

    /**
     * The ghost is spawning, the alpha prop is increasing
     */
    s_spawning() {
        ++this._nOpacity;
        this.setOpacityFlags();
    }

    /**
     * The state of "doing nothing"
     * The ghost is pulsating
     */
    s_idle() {
        this.pulse();
        this.updateVisibilityData();
    }

    /**
     * the ghost has been killed
     */
    s_kill() {
        this.entity.sprite.setCurrentAnimation('death');
    }

    s_dying() {
        this.pulse();
    }

    s_despawn() {
        --this._nOpacity;
        this.setOpacityFlags();
    }

    s_dead() {
        if (!this.entity.dead) {
            this.entity.dead = true;
        }
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

    /**
     * Tests if dead opacity is depleted
     * @returns {boolean}
     */
    t_doneDying() {
        return this.entity.sprite.getCurrentAnimation().frozen;
    }

    t_doneFadeOut() {
        return this._nOpacity <= 0;
    }

    /**
     * returns true if the time is out
     * @returns {boolean}
     */
    t_timeOut() {
        return this.engine.getTime() >= this._nTimeOut;
    }

    /**
     * returns true if target is in melee attack range
     */
    t_targetInMeleeRange() {
        this.entity.position.vector()
    }
}


export default VengefulThinker;