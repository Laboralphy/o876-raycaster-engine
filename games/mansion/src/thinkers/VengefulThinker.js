import GhostThinker from "./GhostThinker";
import * as CONSTS from "../consts";

class VengefulThinker extends GhostThinker {

    constructor() {
        super();
        this.transitions = {
            // recherche joueur cible
            "s_idle": [
                // player dead: plus rien a faire
                ["t_player_dead", "s_job_done"],
                // trouver : commencer la chasse
                ["t_target_found", "s_look_at_target", "s_time_250", "s_start_walk_anim", "s_chase"],
                // attendre 1 seconde puis refaire une recherche
                ["t_target_not_found", "s_time_1000", "s_time_out_then_idle"]
            ],

            // attendre le time out avant de refaire une recherche
            "s_time_out_then_idle": [
                ["t_time_out", "s_idle"]
            ],

            // marcher mais verifier qu'on a toujours le joueur en vue
            "s_chase": [
                // cible touchée
                ["t_hit_player", "s_attack_player", "s_anim_then_idle"],
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

            "s_rebuked": [
                ["t_time_out", "s_idle"]
            ],

            "s_kill": [
                [1, "s_burn"]
            ],

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

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    s_init() {
        super.s_init();
        this.engine.smasher.registerEntity(this.entity);
        this.entity.dummy.tangibility.self = CONSTS.TANGIBILITY_GHOST;
        this.entity.dummy.tangibility.hitmask = CONSTS.TANGIBILITY_PLAYER;
        this.entity.sprite.setCurrentAnimation('walk');
    }

    s_start_walk_anim() {
        this.entity.sprite.setCurrentAnimation('walk');
    }

    s_look_at_target() {
        // rechercher la cible
        this.lookAtTarget();
        this.moveTowardTarget();
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
     * the ghost is wounded : wait for 500ms
     */
    s_wounded_light() {
        this.moveAwayFromTarget();
    }

    /**
     * the ghost is wounded critically
     * it is rebuked
     */
    s_wounded_critical() {
        this.moveAwayFromTarget();
    }

    /**
     * Fantome repoussé
     */
    s_rebuked() {
        this.rebuke()
    }

    s_time_out_then_idle() {
        this.pulse();
    }

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
    s_attack_player() {
        console.log('s_attack_player')
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
    t_hit_player() {
        const s = this.entity.dummy.smashers;
        return s.length > 0 && s.includes(this.target);
    }

    t_player_dead() {
        this.context.game.logic.isPlayerDead();
    }

    t_target_found() {
        return this.isEntityVisible(this.target);
    }

    t_target_not_found() {
        return !this.t_target_found();
    }
}


export default VengefulThinker;