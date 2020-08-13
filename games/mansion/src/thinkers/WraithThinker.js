import GhostThinker from "./GhostThinker";


/**
 * Le thinker va faire bouger une apparition en ligne droite entre deux locators pendant un temps donné
 */
class WraithThinker extends GhostThinker {
    constructor() {
        super();
        this.transitions = {
            "s_init": {
                "1": "s_spawn"
            },
            "s_spawn": {
                // commencer la phase d'apparition = alpha in
                "1": "s_spawning"
            },
            "s_spawning": {
                // lorsque la full opacity est atteinte ...
                "t_fullOpacity": "s_walking"
            },
            "s_walking": {
                // lorsqu'on marche on va verifier qu'on a atteind notre destination
                "t_done": "s_fadeOut"
            },
            "s_fadeOut": {
                "t_doneFadeOut": "s_dead"
            }
        }
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    s_init() {
        // abstract
    }

    /**
     * The ghost just has spawned, still invisible
     */
    s_spawn() {
        this._nOpacity = 0;
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
     * The ghost is pulsating and walking to its destination
     */
    s_walking() {
        this.pulse();
    }

    /**
     * The ghost is vanishing
     */
    s_fadeOut() {
        --this._nOpacity;
        this.setOpacityFlags();
    }

    /**
     * The ghost will cease to exist
     */
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
     * This function is to be overriden
     * @return {boolean}
     */
    t_done() {
        return true;
    }
}