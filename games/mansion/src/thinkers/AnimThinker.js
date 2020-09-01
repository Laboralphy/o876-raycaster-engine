import Thinker from "libs/engine/thinkers/Thinker"

class AnimThinker extends Thinker {
    constructor() {
        super();
        this.automaton.transitions = {
            "s_start": [[1, "s_anim"]],
            "s_anim": [["t_end", "s_end"]]
        };
    }

    s_start() {
        const s = this.entity.sprite;
        s.setCurrentAnimation(s.getFirstAnimation());
    }

    t_end() {
        return this.entity.sprite.getCurrentAnimation().frozen;
    }

    s_end() {
        if (!this.entity.dead) {
            this.entity.dead = true;
        }
    }
}

export default AnimThinker;