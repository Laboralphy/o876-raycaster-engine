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
        this.automaton.defineStates({
            // déplacement vers l'avant
            idle: {
                loop: ['$moveAndPulse'],
                jump: [{
                    test: '$isShot',
                    state: 'despawn'
                }, {
                    test: '$hasArrived',
                    state: 'despawn'
                }]
            },
        })
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    $spawn() {
        // décider de la marche à suivre
        // un spectre va toujours se déplacer en ligne droite, ou bien rester immobile
        // - déterminer le point d'apparition et le point de destination
        super.$spawn();
        const data = this.entity.data.wraith;
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
    }

    /**
     * The ghost is pulsating and walking to its destination
     */
    $moveAndPulse() {
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


    $hasArrived() {
        return this._easing.x.over() && this._easing.y.over();
    }

    $isShot() {
        return !!this.entity.data.shot;
    }
}

export default WraithThinker;
