import UI from '../ui';
import RC from '../index'
import {fetchJSON} from "../fetch-json";

class GameAbstract {

    constructor() {
        this._screen = null;
        this._engine = null;
        this._mouseSensitivity = 0.01;
    }

    initScreen() {
        const surface = document.querySelector('div.game canvas.screen');
        const overlay = document.querySelector('div.game div.overlay');
        const screen = new UI.Screen({
            surface,
            overlay
        });
        screen.setup({
            autostretch: true,
            pointerlock: true
        });
        this._screen = screen;
        return this;
    }

    initEngine() {
        const surface = this._screen.surface;       // getting the surface a.k.a the rendering canvas
        const engine = new RC.Engine();             // create an engine instance
        engine.setRenderingCanvas(surface);         // configure the engine, so it uses our canvas
        this._engine = engine;                      // keeping track of the engine instance
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
        this._screen.on('mousemove', event => {
            const engine = this._engine;
            if (!!engine && !!engine.camera) {
                engine.camera.thinker.look(event.x * this._mouseSensitivity);
            }
        });
    }

    init() {
        this.initScreen();
        this.initEngine();
        this.initListeners();
    }


    async run() {
        this.init();
        const aLevels = await fetchJSON('/game/levels');
        const aExpLevels = aLevels.filter(level => level.exported);
        const level = aExpLevels.shift();
        if (!!level) {
            await this._engine.loadLevel(level.name);
            this._engine.startDoomLoop();
            this._screen.pointerlock.enable();
        }
    }
}

export default GameAbstract;

