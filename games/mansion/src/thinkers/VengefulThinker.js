import GhostThinker from "./GhostThinker";
import * as RC_CONSTS from "libs/raycaster/consts";

class VengefulThinker extends GhostThinker {

    constructor() {
        super();
        this.transitions = {
            // le fantôme est éliminé
            "s_kill": [
                // lorsque mort -> phase de combustion
                ["1", "s_burn"]
            ],

            // on brule
            "s_burn": [
                ["t_burn_anim_over", "s_spawn_flame", "s_despawn"]
            ]
        };
    }

    kill() {
        this.automaton.state = 's_kill';
    }

    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES ////// STATES //////
    s_init() {
        super.s_init();
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

    s_spawn_flame() {
        const p = this.entity.position;
        this.engine.createEntity("o_flame", p);
    }

    s_burn() {
        this.pulse();
    }

    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////
    ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS ////// TRANSITIONS //////

    /**
     * Tests if dead opacity is depleted
     * @returns {boolean}
     */
    t_burn_anim_over() {
        return this.entity.sprite.getCurrentAnimation().frozen;
    }

    t_collision_target() {
        this.entity.collider()
    }

    /**
     * returns true if target is in melee attack range
     */
    t_target_in_melee_range() {
        this.entity.position.vector()
    }
}


export default VengefulThinker;