import GhostThinker from "./GhostThinker";
import Easing from "libs/easing";
import * as CONSTS from "../consts";
import Geometry from "libs/geometry";


/**
 * Le thinker va faire bouger une apparition en ligne droite entre deux locators pendant un temps donné
 */
class WraithThinker extends GhostThinker {
    constructor() {
        super();
        this._easing = {
            x: new Easing(),
            y: new Easing()
        };
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
                // on va vérifer qu'on a pas été shooté
                "t_shot": "s_shot",
                // lorsqu'on marche on va verifier qu'on a atteind notre destination
                "t_done": "s_fadeOut"
            },
            "s_fadeOut": {
                "t_doneFadeOut": "s_dead"
            },
            "s_shot": {
                "1": "s_fadeOut"
            }
        }
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    s_init() {
        // décider de la marche à suivre
        // un spectre va toujours se déplacer en ligne droite, ou bien rester immobile
        // - déterminer le point d'apparition et le point de destination
        const entity = this.entity;
        const data = entity.data.wraith;
        const pFrom = this.entity.position;
        const pTo = data.destination;
        if (pTo === undefined) {
            throw new Error('WraithThinker : "destination" must be specified in wraith data');
        }
        const duration = data.duration || 3000;

        // easing X
        const xe = this._easing.x;
        xe.setFunction(data.easing || Easing.LINEAR);
        xe.setOutputRange(pFrom.x, pTo.x);
        xe.setStepCount(duration);

        // easing Y
        const ye = this._easing.y;
        ye.setFunction(data.easing || Easing.LINEAR);
        ye.setOutputRange(pFrom.y, pTo.y);
        ye.setStepCount(duration);

        this.setLocation(pFrom.x, pFrom.y);
        this.updateSightData();
    }

    /**
     * The ghost just has spawned, still invisible
     */
    s_spawn() {
        this._nOpacity = 0;
        this.setOpacityFlags();
        this.elapsedTime = 0;
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
        // displacement
        const entity = this.entity;
        const t = this.elapsedTime;
        const x = this._easing.x.compute(t).y;
        const y = this._easing.y.compute(t).y;
        entity.position.set({x, y});
        this.pulse();
        this.updateSightData();
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

    /**
     * Que faire quand on a été shooté
     */
    s_shot() {
        // mort directe
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

    t_done() {
        return this._easing.x.over() && this._easing.y.over();
    }

    t_doneFadeOut() {
        return this._nOpacity <= 0;
    }

    t_shot() {
        return !!this.entity.data.shot;
    }
}

export default WraithThinker;
