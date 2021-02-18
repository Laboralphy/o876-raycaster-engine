import GhostThinker from "./GhostThinker";
import * as CONSTS from "../consts";
import Automaton from "libs/automaton";

class VengefulThinker extends GhostThinker {

    constructor() {
        super();
        this._ghostAI = new Automaton();
        this._ghostAI.instance = this;
        this.transitions = {
            // recherche joueur cible
            "s_idle": [
                // player dead: plus rien a faire,
                ["t_target_dead", "s_despawn"],
                // trouver : commencer la chasse
                ["t_target_found", "s_time_250", "s_start_walk_anim", "s_ghost_ai", "s_move_forward"],
                // attendre 1 seconde puis refaire une recherche
                ["t_target_not_found", "s_time_1000", "s_wait_then_idle"]
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
            ]
        };
        this.automaton.state = 's_init';
    }

    kill() {
        this.automaton.state = 's_kill';
    }

    wound(bCritical) {
        this.automaton.state = bCritical ? 's_wounded_critical' : 's_wounded_light';
    }

    get ghostAI() {
        return this._ghostAI;
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////

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
        this.entity.sprite.setCurrentAnimation('death');
    }

    /**
     * the ghost is wounded : set angle to go away from player
     */
    s_wounded_light() {
        this.moveAwayFromTarget(CONSTS.REBUKE_STRENGTH);
    }

    /**
     * the ghost is wounded critically
     * it is rebuked : go away from player
     */
    s_wounded_critical() {
        this.moveAwayFromTarget(CONSTS.REBUKE_STRENGTH * 2);
    }

    /**
     * Fantome repoussé
     */
    s_rebuked() {
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

    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////

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
}

export default VengefulThinker;