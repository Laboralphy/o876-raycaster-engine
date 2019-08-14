import UI from '../ui';
import RC from '../index'
import {fetchJSON} from "../fetch-json";
import Extender from "../object-helper/Extender";
import * as ENGINE_CONSTS from '../engine/consts';
import CanvasHelper from "../canvas-helper";

class GameAbstract {

    constructor() {
        this._screen = null;
        this._engine = null;
        this._options = {
            // activate the FPS mode and use the pointerlock system to control the camera with the mouse.
            // when the user click on the game screen, the mouse button is hidden and the mouse takes control
            // of the camera rotation.
            pointerlock: true,

            // If the navigator window is resized the game surface will also auto-resize to get the maximum
            // space available.
            autostretch: true,

            // the DOM surface element where the game will be rendered.
            surface: document.querySelector('div.game canvas.screen'),

            // the DOM overlay element where the user interface can be displayed
            overlay: document.querySelector('div.game div.overlay'),

            // the mouse sensitivity, lower this value to slow down camera rotation when the mouse is moved
            // this is only useful if "pointerlock" is also true
            mouseSensitivity: 0.01,

            // The camera thinker.
            cameraThinker: 'FPSControlThinker',

            // this function is called back whenever the game loads a level.
            // param phase : a string, the name of the loading phase
            // param f : a float number between 0 and 1. this is the progress indicator, at 0 the game has just
            // begun to load the level, at 1 the game has completed.
            loadProgress: (phase, f) => this.progressFunction(phase, f),



            // this is an url. when the game needs to load a level from the server, it uses this url.
            // DO NOT CHANGE ! // DO NOT CHANGE ! // DO NOT CHANGE !
            fetchLevelAction: ENGINE_CONSTS.FETCH_LEVEL_URL,

            // this is an url. when the game needs to load a data file from the server, it uses this url.
            // DO NOT CHANGE ! // DO NOT CHANGE ! // DO NOT CHANGE !
            fetchDataAction: ENGINE_CONSTS.FETCH_DATA_URL,

            // this is an url. when the game needs to fetch the level list from the server, it uses this url.
            // DO NOT CHANGE ! // DO NOT CHANGE ! // DO NOT CHANGE !
            fetchLevelListAction: ENGINE_CONSTS.FETCH_LEVEL_LIST_URL

        };
        this._runCalled = false;
    }

    get screen() {
        return this._screen;
    }

    get engine() {
        return this._engine;
    }

    /**
     * Should be called once !
     * @return {GameAbstract}
     */
    initScreen() {
        const surface = this._options.surface;
        const overlay = this._options.overlay;
        const screen = new UI.Screen({
            surface,
            overlay
        });
        screen.setup({
            autostretch: this._options.autostretch,
            pointerlock: this._options.pointerlock
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

    /**
     * Displays a message on a canvas, usually to notify an error during the initial phase of game construction.
     * @param sMessage {string};
     */
    displayMessage(sMessage) {
        const canvas = this.screen.surface;
        const context = canvas.getContext('2d');
        const PADDING = 8;
        CanvasHelper.text(
            canvas,
            sMessage,
            PADDING,
            PADDING,
            {
                fill: 'red'
            },
            canvas.width - 2 * PADDING,
            12);
    }

    /**
     * loads a level and starts the doomloop.
     * @param name {string} level name
     * @return {Promise<void>}
     */
    async loadLevel(name) {
        this._engine.stopDoomLoop();
        await this._engine.loadLevel(name, this._options.loadProgress);
        this._engine.startDoomLoop();
        this.enterLevel();
    }

    /**
     * does something special (and synchronous) each time a level is loaded. activates pointerlock.
     */
    enterLevel() {
        if (this._options.pointerlock) {
            this.setMouseSensitivity(this._options.mouseSensitivity);
            this._screen.pointerlock.enable();
        }
    }

    async run() {
        this._runCalled = true;
        this.init();
        const aLevels = await fetchJSON(this._options.fetchLevelListAction);
        const aExpLevels = aLevels.filter(level => level.exported);
        const level = aExpLevels.shift();
        if (!!level) {
            try {
                await this.loadLevel(level.name);
            } catch (e) {
                this.displayMessage('Error: ' + e.message);
            }
        } else {
            this.displayMessage('Error: There is no published level !');
        }
    }
}

export default GameAbstract;

