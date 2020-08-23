import Easing from "libs/easing";
import Thinker from "libs/engine/thinkers/Thinker";
import FadeOut from "../../../../libs/engine/filters/FadeOut";

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
                ["t_finish", "s_fade_out", "s_wait_fade_out"]
            ],
            "s_wait_fade_out": [
                ["t_full_black", "s_next_level", "s_done"]
            ]
        }
        this.automaton.state = 's_init';
        this._fadeOut = new FadeOut({duration: 1000});
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
            .steps(70000)
            .use(Easing.SMOOTHSTEP);
        this.elapsedTime = 0;
    }

    s_run() {
        const y = this._easing.compute(this.elapsedTime).y;
        this.entity.position.y = y;
    }

    s_fade_out() {
        this.engine.filters.link(this._fadeOut);
        this.elapsedTime = 0;
    }

    s_next_level() {
        // achever l'intro, charger le niveau suivant
        const cvs = this.engine.raycaster.renderCanvas;
        const ctx = cvs.getContext('2d');
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        this._fadeOut.terminate();
        this.context.game.loadLevel('mans-cabin').then(() => {
            this.context.game.screen._enablePointerlock = false;
        });
    }

    s_done() {

    }

    t_finish() {
        return this._easing.over();
    }

    t_full_black() {
        return this.elapsedTime > 1500;
    }
}

export default IntroThinker;