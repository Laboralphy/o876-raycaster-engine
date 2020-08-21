import Easing from "libs/easing";
import Thinker from "libs/engine/thinkers/Thinker";

class IntroThinker extends Thinker {
    constructor() {
        super();
        this.frozen = true;
        this._easing = new Easing();
        this.transitions = {
            "s_init": [
                [1, "s_run"]
            ],
            "s_run": [
                ["t_finish", "s_next_level", "s_done"]
            ]
        }
        this.automaton.state = 's_init';
    }

    s_init() {
        const g = this.context.game;
        g.screen._enablePointerlock = false;
        const locStart = g.getLocator('mi_start').position;
        const locFinish = g.getLocator('mi_finish').position;
        this
            ._easing
            .reset()
            .from(locStart.y)
            .to(locFinish.y)
            .steps(100000)
            .use(Easing.SMOOTHSTEP);
        this.elapsedTime = 0;
    }

    s_run() {
        const y = this._easing.compute(this.elapsedTime).y;
        this.entity.position.y = y;
    }

    s_next_level() {
        // achever l'intro, charger le niveau suivant
        this.context.game.loadLevel('mans-cabin').then(() => {
            this.context.game.screen._enablePointerlock = false;
        });
    }

    s_done() {

    }

    t_finish() {
        return this._easing.over();
    }
}

export default IntroThinker;