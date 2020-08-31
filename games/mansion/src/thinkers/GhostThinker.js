import MoverThinker from "libs/engine/thinkers/MoverThinker";
import * as RC_CONSTS from "libs/raycaster/consts";
import * as CONSTS from "../consts";
import Geometry from "libs/geometry";
import Bresenham from "libs/bresenham";
import Easing from "libs/easing";

const PULSE_MAP = [2 ,3, 4, 3];

class GhostThinker extends MoverThinker {

    constructor() {
        super();
        this._nOpacity = 0; // indice de transparence 0 = invisible, 1 = 25% alpha ... 4 = 100% opacity
        this._nTime = 0;
        this._nTimeOut = 0;
        this._target = null; // cible designée
        this.transitions = {
            "s_init": [
                ["1", "s_spawn"]
            ],

            // faire varier l'opacité pour apparition
            "s_spawn": [
                // lorsque la full opacity est atteinte ...
                ["t_full_opacity", "s_idle"]
            ],

            // diminuer l'opacité
            "s_despawn": [
                // lorsque l'opacité est à 0 on dead
                ["t_zero_opacity", "s_dead"]
            ]
        };
    }

    set transitions(value) {
        super.transitions = {
            ...this.automaton._transitions,
            ...value
        };
        this.automaton.state = 's_init';
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
        this._nOpacity = PULSE_MAP[(this._nTime >> 1) & 3];
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
        this.pulse();
        this.updateVisibilityData();
        const ms = this.entity.data.speed;
        const a = this.entity.position.angle;
        this.setSpeed(
            ms * Math.cos(a),
            ms * Math.sin(a)
        );
        this.s_move();
    }

    setTimeOut(n) {
        this._nTimeOut = this.engine.getTime() + n;
    }

    isTimeOut() {
        return this._nTimeOut <= this.engine.getTime();
    }

    /**
     * Updates ghost visibility data
     * That means, all data aimed at resolving how many energy a ghost worth
     */
    updateVisibilityData() {
        const entity = this.entity;
        if (!('visibility' in entity.data)) {
            entity.data.visibility = {
                visible: false, // ghost is visible (even partially) ?
                offset: 0, // last rendered position of the ghost sprite
                size: 0, // apparent size of ghost
                distance: 0, // distance from player to ghost
            };
        }
        const vis = entity.data.visibility;
        // visible or not visible ?
        const bVisible = vis.visible = !!entity.sector && this.engine.raycaster.visibleCells.isMarked(entity.sector.x, entity.sector.y);
        if (!bVisible) {
            // no need to proceed
            return;
        }
        // distance from player to ghost
        const oPlayerPos = this.target.position;
        const oGhostPos = entity.position;
        vis.distance = Geometry.distance(oPlayerPos.x, oPlayerPos.y, oGhostPos.x, oGhostPos.y);

        // ghost position on screen
        const r = entity.sprite.lastRendered;
        vis.offset = r.dx;
        vis.size = r.dw;
    }

	testSolid(x, y) {
		return !this.testWalkable(x, y);
	}

	testWalkable(x, y) {
        const c = this.context.game.engine.getCellType(x, y);
        return c === RC_CONSTS.PHYS_NONE;
	}


    /**
     * Renvoie true si le sujet peut voir la cible.
     * pour que la fonction renvoie true il faut que le sujet puisse voir la cible
     * ceci prend en compte l'invisibilité de la cible,
     * le niveau de detection et l'aveuglement du sujet,
     * les obstacle muraux qui cacheraient éventuellement la cible
     * Si on spécifié les coordonnées d'une secteur, celui ci sera utilisée
     * sinon on utilisera le secteur du mobile
     * @param oTarget cible qu'on cherche à voir
     * @return boolean
     */
    isEntityVisible(oTarget) {
        const oMe = this.entity;
        const xMe = oMe.sector.x;
        const yMe = oMe.sector.y;
        if (!this.testWalkable(xMe, yMe)) {
            return false;
        }
        const xTarget = oTarget.sector.x;
        const yTarget = oTarget.sector.y;
        return Bresenham.line(
            xMe,
            yMe,
            xTarget,
            yTarget,
            (x, y) => this.testWalkable(x, y));
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    s_init() {
        // décider de la marche à suivre
        // un spectre va toujours se déplacer en ligne droite, ou bien rester immobile
        // - déterminer le point d'apparition et le point de destination
        const entity = this.entity;
        const {x, y} = entity.position;
        this.setLocation(x, y);
        this.updateVisibilityData();
        this._nOpacity = 0;
        this.setOpacityFlags();
        this.elapsedTime = 0;
    }

    /**
     * The ghost is spawning, the alpha prop is increasing
     */
    s_spawn() {
        ++this._nOpacity;
        this.setOpacityFlags();
    }

    /**
     * The ghost is vanishing
     */
    s_despawn() {
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

    s_time_1000() {
        this.setTimeOut(1000);
    }

    s_time_500() {
        this.setTimeOut(500);
    }

    s_time_250() {
        this.setTimeOut(250);
    }

    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////

    /**
     * tests if sprite has reach full opacity
     * @returns {boolean}
     */
    t_full_opacity() {
        return this._nOpacity >= 4;
    }

    t_zero_opacity() {
        return this._nOpacity <= 0;
    }

    /**
     * returns true if the time is out
     * @returns {boolean}
     */
    t_time_out() {
        return this.engine.getTime() >= this._nTimeOut;
    }
}


export default GhostThinker;