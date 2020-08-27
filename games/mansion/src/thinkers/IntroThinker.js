import Easing from "libs/easing";
import Thinker from "libs/engine/thinkers/Thinker";
import FadeOut from "../../../../libs/engine/filters/FadeOut";
import SimpleText from "../filters/SimpleText";
import Link from "libs/engine/filters/Link";
import STRINGS from "../../assets/strings";
import CinemaScope from "../filters/CinemaScope";
import Splash from "../filters/Splash";
import CanvasHelper from "libs/canvas-helper";
import AbstractFilter from "libs/filters/AbstractFilter";
const STORY = STRINGS.PLOT_SUMMARY;

class IntroThinker extends Thinker {
    constructor() {
        super();
        this._escapeHit = false;
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
    }

    displayStory(t) {
        const engine = this.context.game.engine;
        engine
            .filters
            .link(this._storyFilter);
    }

    async composeStory() {
        const engine = this.engine;
        const storyMap = [
            {
                "type": "text",
                "text": "arrival"
            },
            {
                "type": "text",
                "text": "dread_lair"
            },
            {
                "type": "splash",
                "photos": [
                    "s0-cult.jpg",
                    "s0-kabbale-1.jpg",
                ],
                "loops": 3
            },
            {
                "type": "text",
                "text": "dark_rituals"
            },
            {
                "type": "splash",
                "photos": [
                    "s0-ritual-forest.jpg",
                    "ng-01.jpg",
                    "ng-02.jpg",
                    "ng-07.jpg",
                    "ng-10.jpg"
                ],
                "loops": 3
            },
            {
                "type": "text",
                "text": "vill_desert" 
            },
            {
                "type": "text",
                "text": "ppl_gone"
            },
            {
                "type": "text",
                "text": "something_happened"
            },
            {
                "type": "text",
                "text": "lost_relics"
            },
            {
                "type": "splash",
                "photos": [
                    "s0-amulet.jpg",
                    "s5-altar.jpg",
                    "s5-altar-2.jpg"
                ],
                "loops": 4
            },
            {
                "type": "text",
                "text": "phat_loot"
            }
        ];
        const buildTextFilter = data => {
            const s = STRINGS.PLOT_STRUCT[data.text];
            if (s === undefined) {
                throw new Error('this resource string does not exist : ' + data.text);
            }
            const oText = new SimpleText();
            const cvs = engine.getRenderingCanvas();
            oText.text(s, cvs.width >> 1, cvs.height >> 1);
            return Promise.resolve(oText);
        };
        const buildSplashFilter = async ({photos, loops}) => {
            try {
                const promPhotos = photos.map(p => CanvasHelper.loadCanvas('assets/splashes/intro/' + p));
                const aResolvedPhotos = await Promise.all(promPhotos);
                return new Splash(
                    aResolvedPhotos,
                    loops
                );
            } catch (e) {
                console.error(e);
            }
        }
        const promStory = storyMap.map(data => {
            switch (data.type) {
                case 'text':
                    return buildTextFilter(data);

                case 'splash':
                    return buildSplashFilter(data);

                default:
                    throw new Error('unknown intro verb: ' + data.type + ' need [text, splash]');
            }
        });
        return Promise.all(promStory);
    }

    keyDown(key) {
        switch (key) {
            case 'Escape':
                this._escapeHit = true;
                break;
        }
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
        this._fadeOut = new FadeOut({duration: 1000});
        this._storyFilter = null;
        this.composeStory().then(s => {
            this._storyFilter = new Link(s);
            //this.engine.filters.link(this._storyFilter);
            this.engine.delayCommand(() => this.displayStory(), 3000 - this.elapsedTime);
        });
        this._cinemascope = new CinemaScope(15);
        this.engine.filters.link(this._cinemascope);
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
        this.context.game.loadLevel('mans-cabin').then(() => {
            this.context.game.screen._enablePointerlock = true;
            this._fadeOut.terminate();
            if (this._storyFilter instanceof AbstractFilter) {
                this._storyFilter.terminate();
            }
            this._cinemascope.terminate();
        });
    }

    s_done() {
    }

    t_finish() {
        return this._escapeHit || this._easing.over();
    }

    t_full_black() {
        return this.elapsedTime > 1500;
    }
}

export default IntroThinker;