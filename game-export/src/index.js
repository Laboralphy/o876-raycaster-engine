import UI from '../../lib/src/ui';
import RC from '../../lib/src'
import Interface from './Interface';
import {fetchJSON} from "../../lib/src/fetch-json";

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
        const aLevels = await fetchJSON('/game/levels');
        const aExpLevels = aLevels.filter(level => level.exported);
        const level = aExpLevels.shift();
        if (!!level) {
            await this._engine.loadLevel(level);
            this._engine.startDoomLoop();
        }
    }
}

window.addEventListener('load', main);


