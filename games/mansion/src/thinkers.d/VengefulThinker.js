import GhostThinker from "./GhostThinker";
import * as CONSTS from "../consts";
import Automaton from "libs/automaton/v2";
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
        this._nGhostTimeOut = 0;
        this._bWounded = false;
        this._bShutterChance = false;
        this._teleportDestination = null;
        this._teleportAnim = 0;
        this.automaton.defineStates({
            idle: {
                jump: [{
                    test: '$isTeleportReady',
                    state: 'teleport'
                }, {
                    test: '$isTargetDead',
                    state: 'despawn'
                }, {
                    test: '$isTargetFound',
                    state: 'ghostAI'
                }, {
                    test: '$isTargetNotFound',
                    state: 'teleportNearTarget'
                }]
            },
            teleportNearTarget: {
                init: [
                    '$setTimeOut 1000'
                ],
                done: [
                    '$computeTeleportInSight'
                ],
                jump: [{
                    test: '$isTimeOut',
                    state: 'teleport'
                }]
            },
            ghostAI: {
                init: [
                    '$setTimeOut 250',
                    '$setAnimation walk',
                    '$dump',
                    '$doGhostAi',
                ],
                loop: [
                    '$pulse',
                    '$moveForward'
                ],
                jump: [{
                    test: '$isTargetHit',
                    state: 'attack'
                }, {
                    test: '$isTimeOut',
                    state: 'idle'
                }]
            },
            attack: {
                init: [
                    '$doAttackTarget',
                    '$setTimeOut 750'
                ],
                jump: [{
                    test: '$isTimeOut',
                    state: 'idle'
                }]
            },
            teleport: {
                init: ['$doTeleportVanish'],
                loop: ['$doTeleportPulse'],
                done: ['$doTeleportMove'],
                jump: [{
                    test: '$isTeleportAnimDone',
                    state: 'spawn'
                }]
            },
            wounded: {
                init: [
                    '$setTimeOut 600',
                    '$rebuke 1'
                ],
                jump: [{
                    test: '$isTimeOut',
                    state: 'idle'
                }]
            },
            woundedCritical: {
                init: [
                    '$setTimeOut 750',
                    '$rebuke 2'
                ],
                jump: [{
                    test: '$isTimeOut',
                    state: 'idle'
                }]
            },
            burning: {
                done: [
                    '$spawnFlame'
                ],
                loop: [
                    '$pulse'
                ],
                jump: [{
                    test: '$isCurrentAnimOver',
                    state: 'despawn'
                }]
            }
        })
        /*
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

            "s_teleport_behind_target": [
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

         */
        this.setupGhostAI()
    }

    setupGhostAI () {
        const gai = this._ghostAI
        gai.events.on('test', ({
           test,
           parameters,
           pass
        }) => {
            pass(this._invoke(test, ...parameters))
        })
        gai.events.on('action', ({
            action,
            parameters
        }) => {
            this._invoke(action, ...parameters)
        })
        gai.defineStates({
            'init': {}
        })
        gai.initialState = 'init'
    }

    get shutterChance () {
        return this._bShutterChance;
    }

    kill() {
        this._bShutterChance = false;
        this.entity.sprite.setCurrentAnimation('death');
        this.context.game.soundEvent(CONSTS.AUDIO_EVENT_GHOST_DIE, { entity: this.entity })
        this.automaton.state = 'burning';
    }

    wound(bCritical) {
        if (this.automaton.state !== 'wounded' && this.automaton.state !== 'woundedCritical') {
            this._bWounded = true;
            this.automaton.state = (this._bShutterChance || bCritical) ? 'woundedCritical' : 'wounded';
        }
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

    /**
     * Calculer une destination de téléportation proche
     */
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

    compareTargetDistance (n) {
        if (this.target) {
            const n2 = n * n
            const mpos = this.entity.position
            const opos = this.target.position
            return Math.sign(Geometry.squareDistance(mpos.x, mpos.y, opos.x, opos.y) - n2);
        } else {
            throw new Error('this entity has no target')
        }
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

    _setGhostTimeOut (n) {
        this._nGhostTimeOut = this.engine.getTime() + n;
    }

    s_time_reset () {
        this._nGhostTimeOut = 0;
    }

    $shutterChance (bOn) {
        this._bShutterChance = bOn;
    }

    /**
     * Etat initialisation
     */
    $init() {
        super.$init();
        this.entity.sprite.setCurrentAnimation('walk');
    }

    $moveFormat() {
        this.moveForward()
    }

    /**
     * Etat : démarrer animation marche
     */
    $setAnimation(sAnim) {
        this.entity.sprite.setCurrentAnimation(sAnim);
    }

    /**
     * The state of "doing nothing"
     * The ghost is pulsating
     */
    $pulse() {
        this.pulse();
        this.updateVisibilityData();
    }

    /**
     * the ghost is wounded : set angle to go away from player
     */
    $rebuke(factor = 1) {
        this._bShutterChance = false;
        this.moveAwayFromTarget(CONSTS.REBUKE_STRENGTH * factor);
        this.context.game.soundEvent(CONSTS.AUDIO_EVENT_GHOST_WOUNDED, { entity: this.entity })
    }

    /**
     * A blueflame is spawned
     */
    $spawnFlame() {
        const p = this.entity.position;
        const oFlame = this.engine.createEntity("o_flame", p);
        this.context.game.soundEvent(CONSTS.AUDIO_EVENT_GHOST_BURN, { entity: oFlame })
    }

    /**
     * the ghost plays an attack animation
     */
    $doAttackTarget() {
        this.entity.sprite.setCurrentAnimation('attack');
        this.entity.sprite.getCurrentAnimation().reset();
        // wound player
        this.context.game.commitGhostAttack(this.entity, this.target);
    }


    $computeTeleportInSight() {
        this.computeTeleportInsideVisibilityCone();
        this._teleportAnim = 0;
    }

    $computeTeleportBehindTarget() {
        this.computeTeleportBehind();
        this._teleportAnim = 0;
    }

    $doTeleportPulse() {
        this._nOpacity = PULSE_MAP_LARGE[this._teleportAnim];
        this.setOpacityFlags();
        ++this._teleportAnim;
    }

    $doTeleportVanish() {
        this._teleportAnim = 0;
        this._nOpacity = 0;
        this.setOpacityFlags();
    }

    $doTeleportMove() {
        if (this._teleportDestination) {
            const { x, y } = this._teleportDestination;
            this.entity.position.set(this.engine.getCellCenter(x, y));
            this._teleportDestination = null;
        }
    }

    $doGhostAi () {
        this._ghostAI.process()
    }

    $dump () {
        const ent = this.entity
        const tgt = this.target

    }

    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////

    gt_time_out () {
        return this.engine.getTime() >= this._nGhostTimeOut;
    }

    $isWounded () {
        const bWounded = this._bWounded;
        this._bWounded = false;
        return bWounded;
    }

    $isWoundedCritical () {
        if (this._bWounded && this._bShutterChance) {
            this._bWounded = false;
            this._bShutterChance = false;
            return true
        }
        this._bWounded = false;
        return false;
    }

    gt_has_teleported () {
        return this._teleportDestination === null;
    }

    /**
     * Tests if dead opacity is depleted
     * @returns {boolean}
     */
    $isCurrentAnimOver() {
        return this.entity.sprite.getCurrentAnimation().frozen;
    }

    /**
     * The ghost has it player
     */
    $isTargetHit() {
        const d = this.compareTargetDistance(this.target.size + this.entity.size)
        return d <= 0
    }

    $isTargetDead() {
        return this.context.game.logic.isPlayerDead();
    }

    $isTargetFound() {
        return this.isEntityVisible(this.target) && !this.$isTargetDead();
    }

    $isTargetNotFound() {
        return !this.$isTargetFound();
    }

    $isTeleportReady () {
        return this._teleportDestination !== null;
    }

    $isTeleportAnimDone () {
        return this._teleportAnim >= (PULSE_MAP_LARGE.length - 1);
    }
}

export default VengefulThinker;
