import GhostThinker from "./GhostThinker";
import * as CONSTS from "../consts";
import Automaton from "libs/automaton";
import Geometry from 'libs/geometry'
import * as RC_CONSTS from 'libs/raycaster/consts'

const PULSE_MAP_LARGE = [4, 3, 2, 1, 2, 3, 2, 1, 0, 1, 2, 1, 0, 1, 0];

/**
 * gt_time_out : renvoie true quand le time out est terminé
 * gt_wounded : renvoie true quand le fantome est bléssé
 * gt_has_teleported: renvoie true quand le fantome vien de se teleporté
 *
 * gs_time_XXX : initialise le timer à XXX millisecondes
 * gs_shutter_chance_on: allume le shutter chance
 * gs_shutter_chance_off: éteint le shutter chance
 *
 */
class VengefulThinker extends GhostThinker {

    constructor() {
        super();
        this._ghostAI = new Automaton();
        this._ghostAI.instance = this;
        this._nGhostTimeOut = 0;
        this._bWounded = false;
        this._bShutterChance = false;
        this._teleportDestination = null;
        this._teleportAnim = 0;
        this.transitions = {
            // recherche joueur cible
            "s_idle": [
                ["t_teleport_ready", "s_teleport"],
                // player dead: plus rien a faire,
                ["t_target_dead", "s_despawn"],
                // trouver : commencer la chasse
                ["t_target_found", "s_time_250", "s_start_walk_anim", "s_ghost_ai", "s_move_forward"],
                // attendre 1 seconde puis refaire une recherche
                ["t_target_not_found", "s_time_1000", "s_wait_then_teleport_in_sight"]
            ],

            "s_wait_then_teleport_in_sight": [
                ["t_time_out", "s_teleport_in_sight"]
            ],

            // attendre le time out avant de refaire une recherche
            "s_wait_then_idle": [
                ["t_time_out", "s_idle"]
            ],

            // marcher mais verifier qu'on a toujours le joueur en vue
            "s_move_forward": [
                // cible touchée
                ["t_hit_target", "s_attack_target", "s_time_750", "s_wait_then_idle"],
                // temps écoulé , choisir une autre action
                ["t_time_out", "s_idle"]
            ],

            // attendre la fin naturelle de l'animation en cours
            "s_anim_then_idle": [
                ["t_anim_over", "s_idle"]
            ],

            // fantome blessé
            "s_wounded_light": [
                [1, "s_time_750", "s_rebuked"]
            ],

            // fantome blessé
            "s_wounded_critical": [
                [1, "s_time_1000", "s_rebuked"]
            ],

            // fantome repoussé
            "s_rebuked": [
                ["t_time_out", "s_idle"]
            ],

            // fantome eliminé
            "s_kill": [
                [1, "s_burn"]
            ],

            // flamme bleue
            "s_burn": [
                ["t_anim_over", "s_spawn_flame", "s_despawn"]
            ],

            "s_teleport_in_sight": [
                [1, "s_teleport"]
            ],

            "s_teleport": [
                [1, "s_teleport_pulse"]
            ],

            "s_teleport_pulse": [
                ["t_teleport_anim_done", "s_teleport_move", "s_spawn"]
            ]
        };
        this.automaton.state = 's_init';
    }

    get shutterChance () {
        return this._bShutterChance;
    }

    kill() {
        this.automaton.state = 's_kill';
    }

    wound(bCritical) {
        this._bWounded = true;
        this.automaton.state = (this._bShutterChance || bCritical) ? 's_wounded_critical' : 's_wounded_light';
    }

    get ghostAI() {
        return this._ghostAI;
    }

    /**
     * Choose a location inside the target's cone of visibility
     */
    computeTeleportInsideVisibilityCone () {
        const engine = this.engine;
        const target = this.target;
        const targetPos = target.position;
        const rc = engine.raycaster;
        const nDistance = this.getDistanceToTarget();
        const aVisibleSectors = rc
          .visibleFrontCells
          .toArray()
          .map(({ x, y }) => {
              const cc = engine.getCellCenter(x, y)
              return {
                  x,
                  y,
                  distance: Geometry.distance(cc.x, cc.y, targetPos.x, targetPos.y)
              }
          })
          .sort((a, b) => Math.abs(nDistance - a.distance) - Math.abs(nDistance - b.distance))
        if (aVisibleSectors.length > 0) {
            this._teleportDestination = aVisibleSectors[0];
        } else {
            // la cible à le nez collé au mur
            // il va falloir se teleporter derrière son dos
            // ou attendre... de toutes facon le joueur doit bouger au bout d'un moment.
        }
    }

    computeTeleportBehind () {
        const engine = this.engine;
        const target = this.target;
        const targetPos = target.position;
        const vCellBehind = targetPos.front(-engine.cellSize * 1.5);
        // test if cell is walkable
        const cc = engine.clipCell(vCellBehind.x, vCellBehind.y);
        if (engine.getCellType(cc.x, cc.y) === RC_CONSTS.PHYS_NONE) {
            console.log('teleport to', cc)
            this._teleportDestination = cc;
        } else {
            // la cellule derrière la cible n'est pas traversable.
            console.log('could not teleport to', cc)
            this._teleportDestination = null;
        }
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    _setGhostTimeOut (n) {
        this._nGhostTimeOut = this.engine.getTime() + n;
    }

    gs_time_250 () {
        this._setGhostTimeOut(250);
    }

    gs_time_333 () {
        this._setGhostTimeOut(333);
    }

    gs_time_500 () {
        this._setGhostTimeOut(500);
    }

    gs_time_750 () {
        this._setGhostTimeOut(750);
    }

    gs_time_1000 () {
        this._setGhostTimeOut(1000);
    }

    gs_time_2000 () {
        this._setGhostTimeOut(2000);
    }

    gs_time_3000 () {
        this._setGhostTimeOut(3000);
    }

    gs_shutter_chance_on () {
        this._bShutterChance = true;
    }

    gs_shutter_chance_off () {
        this._bShutterChance = false;
    }

    /**
     * Etat initialisation
     */
    s_init() {
        super.s_init();
        this.engine.smasher.registerEntity(this.entity);
        this.entity.dummy.tangibility.self = CONSTS.TANGIBILITY_GHOST;
        this.entity.dummy.tangibility.hitmask = CONSTS.TANGIBILITY_PLAYER;
        this.entity.sprite.setCurrentAnimation('walk');
    }

    s_move_forward() {
        this.moveForward()
    }

    s_ghost_ai() {
        this._ghostAI.process();
    }

    /**
     * Etat : démarrer animation marche
     */
    s_start_walk_anim() {
        this.entity.sprite.setCurrentAnimation('walk');
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
        this._bShutterChance = false;
        this.entity.sprite.setCurrentAnimation('death');
    }

    /**
     * the ghost is wounded : set angle to go away from player
     */
    s_wounded_light() {
        this._bShutterChance = false;
        this.moveAwayFromTarget(CONSTS.REBUKE_STRENGTH);
    }

    /**
     * the ghost is wounded critically
     * it is rebuked : go away from player
     */
    s_wounded_critical() {
        this._bShutterChance = false;
        this.moveAwayFromTarget(CONSTS.REBUKE_STRENGTH * 2);
    }

    /**
     * Fantome repoussé
     */
    s_rebuked() {
        this._bShutterChance = false;
        this.rebuke()
    }

    /**
     * attente fin de timer avant passe en idle
     */
    s_wait_then_idle() {
        this.pulse();
    }

    /**
     * attente fin d'animation avant passe en idle
     */
    s_anim_then_idle() {
        this.pulse();
    }

    /**
     * The ghost is waiting before spawning flame and fading out
     */
    s_burn() {
        this.pulse();
    }

    /**
     * A blueflame is spawned
     */
    s_spawn_flame() {
        const p = this.entity.position;
        this.engine.createEntity("o_flame", p);
    }

    /**
     * the ghost plays an attack animation
     */
    s_attack_target() {
        this.entity.sprite.setCurrentAnimation('attack');
        this.entity.sprite.getCurrentAnimation().reset();
        // wound player
        this.context.game.commitGhostAttack(this.entity, this.target);
    }


    s_teleport_in_sight() {
        this.computeTeleportInsideVisibilityCone();
        this._teleportAnim = 0;
    }

    s_teleport_pulse() {
        this._nOpacity = PULSE_MAP_LARGE[this._teleportAnim];
        this.setOpacityFlags();
        ++this._teleportAnim;
    }

    s_teleport() {
        this._teleportAnim = 0;
        this._nOpacity = 0;
        this.setOpacityFlags();
    }

    s_teleport_move() {
        if (this._teleportDestination) {
            const { x, y } = this._teleportDestination;
            this.entity.position.set(this.engine.getCellCenter(x, y));
            this._teleportDestination = null;
        }
    }

    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////

    gt_time_out () {
        return this.engine.getTime() >= this._nGhostTimeOut;
    }

    gt_wounded () {
        const bWounded = this._bWounded;
        this._bWounded = false;
        return bWounded;
    }

    gt_has_teleported () {
        return this._teleportDestination === null;
    }

    /**
     * Tests if dead opacity is depleted
     * @returns {boolean}
     */
    t_anim_over() {
        return this.entity.sprite.getCurrentAnimation().frozen;
    }

    /**
     * The ghost has it player
     */
    t_hit_target() {
        const s = this.entity.dummy.smashers;
        return s.length > 0 && s.includes(this.target);
    }

    t_target_dead() {
        return this.context.game.logic.isPlayerDead();
    }

    t_target_found() {
        return this.isEntityVisible(this.target) && !this.t_target_dead();
    }

    t_target_not_found() {
        return !this.t_target_found();
    }

    t_teleport_ready () {
        return this._teleportDestination !== null;
    }

    t_teleport_anim_done () {
        return this._teleportAnim >= (PULSE_MAP_LARGE.length - 1);
    }
}

export default VengefulThinker;
