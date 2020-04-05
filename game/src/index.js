import UI from '../../lib/src/ui';
import RC from '../../lib/src'
import Interface from './Interface';
import {fetchJSON} from "../../lib/src/fetch-json";
import FadeIn from "../../lib/src/engine/filters/FadeIn";
import Easing from "../../lib/src/easing";

class Game {

    constructor() {
        this._screen = null;
        this._engine = null;
    }

    initScreen() {
        const screen = new UI.Screen({
            surface: document.querySelector('div.game canvas.screen'),
            overlay: document.querySelector('div.game div.overlay')
        });
        screen.setup({
            autostretch: true,
            pointerlock: true
        });
        this._screen = screen;
        return this;
    }

    initEngine() {
        const surface = this._screen.surface;
        const engine = new RC.Engine();
        engine.setRenderingCanvas(surface);
        this._engine = engine;
        return this;
    }

    initListeners() {
        window.addEventListener('keydown', event => {
            const engine = this._engine;
            if (!!engine && !!engine.camera) {
                engine.camera.thinker.keyDown(event.key)
            }
        });
        window.addEventListener('keyup', event => {
            const engine = this._engine;
            if (!!engine && !!engine.camera) {
                engine.camera.thinker.keyUp(event.key)
            }
        });
        this._screen.pointerlock.on('mousemove', event => {
            console.log('Game mousemove', event);
        })
    }

    init() {
        this.initScreen();
        this.initEngine();
    }

    async main() {
        this.init();
        const aLevels = await fetchJSON('/game/levels');
        const aExpLevels = aLevels.filter(level => level.exported);
        const level = aExpLevels.shift();
        if (!!level) {
            await this._engine.loadLevel(level.name);
            this._engine.startDoomLoop();

            this._engine.delayCommand(() =>  {
                console.log('start');
                this._engine.raycaster.linkFilter(new FadeIn({
                    color: 'black',
                    duration: 777,
                    easing: Easing.SMOOTHSTEP
                }))
            }, 1000);
        }
    }
}

window.addEventListener('load', function() {
    const g = new Game();
    g.main();
});


