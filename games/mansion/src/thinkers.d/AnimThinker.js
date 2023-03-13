import Thinker from "libs/engine/thinkers/Thinker"

class AnimThinker extends Thinker {
    constructor() {
        super();
        this.automaton.defineStates({
            "start": {
                init: ['$setFirstAnimation'],
                jump: [{
                    test: '$isEnd',
                    state: 'end'
                }]
            },
            "end": {
                init: ['$killEntity']
            }
        });
        this.automaton.initialState = 'start'
    }

    $setFirstAnimation() {
        const s = this.entity.sprite;
        s.setCurrentAnimation(s.getFirstAnimation());
    }

    $isEnd() {
        return this.entity.sprite.getCurrentAnimation().frozen;
    }

    $killEntity() {
        if (!this.entity.dead) {
            this.entity.dead = true;
        }
    }
}

export default AnimThinker;