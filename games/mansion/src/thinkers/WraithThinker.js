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
            // déplacement vers l'avant
            "s_idle": [
                // on va vérifer qu'on a pas été shooté
                ["t_shot", "s_despawn"],
                // lorsqu'on marche on va verifier qu'on a atteint notre destination
                ["t_arrived", "s_despawn"]
            ]
        }
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    s_init() {
        // décider de la marche à suivre
        // un spectre va toujours se déplacer en ligne droite, ou bien rester immobile
        // - déterminer le point d'apparition et le point de destination
        super.s_init();
        const data = this.entity.data.wraith;
        const pFrom = this.entity.location;
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
    }

    /**
     * The ghost is pulsating and walking to its destination
     */
    s_idle() {
        // displacement
        const entity = this.entity;
        const t = this.elapsedTime;
        const x = this._easing.x.compute(t).y;
        const y = this._easing.y.compute(t).y;
        entity.position.set({x, y});
        this.pulse();
        this.updateVisibilityData();
    }

    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////


    t_arrival() {
        return this._easing.x.over() && this._easing.y.over();
    }

    t_shot() {
        return !!this.entity.data.shot;
    }
}

export default WraithThinker;
