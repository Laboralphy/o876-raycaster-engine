import UI from '../ui';
import RC from '../index'
import {fetchJSON} from "../fetch-json";
import Extender from "../object-helper/Extender";

class GameAbstract {

    constructor() {
        this._screen = null;
        this._engine = null;
        this._options = {
            pointerlock: true,
            autostretch: true,
            surface: document.querySelector('div.game canvas.screen'),
            overlay: document.querySelector('div.game div.overlay'),
            mouseSensitivity: 0.01,
            cameraThinker: 'FPSControlThinker',
            loadProgress: (phase, f) => this.progressFunction(phase, f)
        };
        this._runCalled = false;
    }

    get screen() {
        return this._screen;
    }

    get engine() {
        return this._engine;
    }

    initScreen() {
        const surface = this._options.surface;
        const overlay = this._options.overlay;
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
        engine._config.cameraThinker = this._options.cameraThinker;
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
        if (this._options.pointerlock) {
            this._screen.on('mousemove', event => {
                const engine = this._engine;
                if (!!engine && !!engine.camera) {
                    engine.camera.thinker.look(event.x);
                }
            });
        }
    }

    init() {
        this.initScreen();
        this.initEngine();
        this.initListeners();
    }

    config(options) {
        if (this._runCalled) {
            throw new Error('you must config() BEFORE run(), not after.')
        }
        Extender.objectExtends(this._options, options);
    }

    setMouseSensitivity(f) {
        this._engine.camera.thinker.setLookFactor(f);
    }

    progressFunction(phase, f) {
        const canvas = this.screen.surface;
        const context = canvas.getContext('2d');
        const LINEWIDTH = 6;
        const SIZE = 32;
        const xCenter = canvas.width >> 1;
        const yCenter = canvas.height >> 1;
        context.lineWidth = LINEWIDTH;
        context.clearRect(
            xCenter - (SIZE >> 1),
            yCenter - (SIZE >> 1),
            SIZE,
            SIZE
        );
        context.strokeStyle = '#222';
        context.beginPath();
        context.arc(xCenter, yCenter, SIZE - (LINEWIDTH >> 1), 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = 'white';
        context.beginPath();
        context.arc(xCenter, yCenter, SIZE - (LINEWIDTH >> 1), 0, Math.PI * 2 * f);
        context.stroke();
    }

    loadLevel(name) {
        return this._engine.loadLevel(name, this._options.loadProgress);
    }

    async run() {
        this._runCalled = true;
        this.init();
        const aLevels = await fetchJSON('/game/levels');
        const aExpLevels = aLevels.filter(level => level.exported);
        const level = aExpLevels.shift();
        if (!!level) {
            await this.loadLevel(level.name);
            this._engine.startDoomLoop();
            if (this._options.pointerlock) {
                this.setMouseSensitivity(this._options.mouseSensitivity);
                this._screen.pointerlock.enable();
            }
        }
    }
}

export default GameAbstract;

