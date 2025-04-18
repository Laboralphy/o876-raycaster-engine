import UI from '../ui';
import Engine from '../engine/Engine'
import {fetchJSON} from "../fetch-json";
import Extender from "../object-helper/Extender";
import * as ENGINE_CONSTS from '../engine/consts';
import CanvasHelper from "../canvas-helper";

const SERIAL_VERSION = 1;

// built in path values
const FETCH_LEVEL_URL = './assets/levels/:name.json';
const FETCH_DATA_URL = './assets/data/:name.json';
const FETCH_LEVEL_LIST_URL = './levels';

class GameAbstract {

    constructor() {
        this._debug = false;
        this._logGroups = [];
        this._screen = null;
        this._engine = null;
        this._options = {
            // activate the FPS mode and use the pointerlock system to control the visor with the mouse.
            // when the user click on the game screen, the mouse button is hidden and the mouse takes control
            // of the visor rotation.
            pointerlock: true,

            // If the navigator window is resized the game surface will also auto-resize to get the maximum
            // space available.
            autostretch: true,

            // the DOM surface element where the game will be rendered.
            surface: document.querySelector('div.game canvas.screen'),

            // the DOM overlay element where the user interface can be displayed
            overlay: document.querySelector('div.game div.overlay'),

            // the mouse sensitivity, lower this value to slow down visor rotation when the mouse is moved
            // this is only useful if "pointerlock" is also true
            mouseSensitivity: 0.01,

            // The visor thinker.
            cameraThinker: 'FPSControlThinker',

            // declared thinker
            thinkers: {},

            // this function is called back whenever the game loads a level.
            // param phase : a string, the name of the loading phase
            // param f : a float number between 0 and 1. this is the progress indicator, at 0 the game has just
            // begun to load the level, at 1 the game has completed.
            loadProgress: (phase, f) => this.progressFunction(phase, f),

            // auto load the first level available
            autoload: true,

            // this is an url. when the game needs to load a level from the server, it uses this url.
            // DO NOT CHANGE ! // DO NOT CHANGE ! // DO NOT CHANGE !
            fetchLevelAction: FETCH_LEVEL_URL,

            // this is an url. when the game needs to load a data file from the server, it uses this url.
            // DO NOT CHANGE ! // DO NOT CHANGE ! // DO NOT CHANGE !
            fetchDataAction: FETCH_DATA_URL,

            // this is an url. when the game needs to fetch the level list from the server, it uses this url.
            // DO NOT CHANGE ! // DO NOT CHANGE ! // DO NOT CHANGE !
            fetchLevelListAction: FETCH_LEVEL_LIST_URL

        };
        this._runCalled = false;
    }



//  _                                             _   _
// | |    ___   __ _    ___  _ __   ___ _ __ __ _| |_(_) ___  _ __  ___
// | |   / _ \ / _` |  / _ \| '_ \ / _ \ '__/ _` | __| |/ _ \| '_ \/ __|
// | |__| (_) | (_| | | (_) | |_) |  __/ | | (_| | |_| | (_) | | | \__ \
// |_____\___/ \__, |  \___/| .__/ \___|_|  \__,_|\__|_|\___/|_| |_|___/
//             |___/        |_|


    log(...args) {
        if (this._debug) {
            console.log('[g]', ...args);
        }
    }

    logGroup(sGroup, ...args) {
        if (this._debug) {
            console.group(sGroup);
            this._logGroups.push(sGroup);
        }
    }

    logGroupEnd() {
        if (this._debug) {
            console.groupEnd(this._logGroups.pop());
        }
    }





//             _   _
//   __ _  ___| |_| |_ ___ _ __ ___
//  / _` |/ _ \ __| __/ _ \ '__/ __|
// | (_| |  __/ |_| ||  __/ |  \__ \
//  \__, |\___|\__|\__\___|_|  |___/
//  |___/

    get screen() {
        return this._screen;
    }

    get engine() {
        return this._engine;
    }

    get options() {
        return this._options;
    }




//  _       _ _   _       _ _           _
// (_)_ __ (_) |_(_) __ _| (_)___  __ _| |_ ___  _ __ ___
// | | '_ \| | __| |/ _` | | / __|/ _` | __/ _ \| '__/ __|
// | | | | | | |_| | (_| | | \__ \ (_| | || (_) | |  \__ \
// |_|_| |_|_|\__|_|\__,_|_|_|___/\__,_|\__\___/|_|  |___/

    /**
     * Should be called once !
     * @return {GameAbstract}
     */
    initScreen() {
        this.log('init screen')
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

    /**
     * engine initialisation
     * @return {GameAbstract}
     */
    initEngine() {
        this.log('init engine')
        const surface = this._screen.surface;       // getting the surface a.k.a the rendering canvas
        const engine = new Engine();             // create an engine instance
        engine.config.cameraThinker = this._options.cameraThinker;
        engine.useThinkers(this._options.thinkers);
        engine.setRenderingCanvas(surface);         // configure the engine, so it uses our canvas
        engine.events.on('level.loading', ({phase, progress}) => this.progressFunction(phase, progress));
        this._engine = engine;                      // keeping updateEntity of the engine instance
        return this;
    }

    /**
     * handler initialisation
     */
    initListeners() {
        this.log('install event listeners')
        window.addEventListener('keydown', event => {
            this.keyDownHandler(event.key);
        });
        window.addEventListener('keyup', event => {
            this.keyUpHandler(event.key);
        });
        window.addEventListener('mousedown', event => {
            this.keyDownHandler('Mouse' + event.button);
        });
        window.addEventListener('mouseup', event => {
            this.keyUpHandler('Mouse' + event.button);
        });
        if (this._options.pointerlock) {
            this.screen.on('mousemove', event => {
                const x = event.x
                this.invokeCameraThinkerFunction('look', x);
            });
        }
    }

    init() {
        this.log('init game');
        this.initScreen();
        this.initEngine();
        this.initListeners();
    }

    initAsync() {
        this.log('async init game');
        return Promise.resolve();
    }


    config(options) {
        if (this._runCalled) {
            throw new Error('you must config() BEFORE run(), not after.')
        }
        Extender.objectExtends(this._options, options, true);
    }


//  _                                     _     _                     _ _
// | | _____ _   _    _____   _____ _ __ | |_  | |__   __ _ _ __   __| | | ___ _ __ ___
// | |/ / _ \ | | |  / _ \ \ / / _ \ '_ \| __| | '_ \ / _` | '_ \ / _` | |/ _ \ '__/ __|
// |   <  __/ |_| | |  __/\ V /  __/ | | | |_  | | | | (_| | | | | (_| | |  __/ |  \__ \
// |_|\_\___|\__, |  \___| \_/ \___|_| |_|\__| |_| |_|\__,_|_| |_|\__,_|_|\___|_|  |___/
//           |___/

    keyUpHandler(key) {
        this.invokeCameraThinkerFunction('keyUp', key);
    }

    keyDownHandler(key) {
        this.invokeCameraThinkerFunction('keyDown', key);
    }

    invokeCameraThinkerFunction(sFunction, ...args) {
        if (this._engine && this._engine.camera && this._engine.camera.thinker) {
            const t = this._engine.camera.thinker;
            if (typeof t[sFunction] === 'function') {
                t[sFunction](...args);
            }
        }
    }

    setMouseSensitivity(f) {
        this.invokeCameraThinkerFunction('setLookFactor', f);
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
            0,
            0,
            canvas.width,
            canvas.height
        );
        context.strokeStyle = '#222';
        context.beginPath();
        context.arc(xCenter, yCenter, SIZE - (LINEWIDTH >> 1), 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = 'white';
        context.beginPath();
        const fPhase = Math.PI * 1.5;
        context.arc(xCenter, yCenter, SIZE - (LINEWIDTH >> 1), fPhase, Math.PI * 2 * f + fPhase);
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
     * @param data {object} level name
     * @param extra {object} extra json data to be loaded as tilesets and blueprints
     * @return {Promise<void>}
     */
    async buildLevel(data, extra = {}) {
        const engine = this._engine;
        this.log('building level');
        engine.stopDoomLoop();
        await engine.buildLevel(data, extra);
        this.log('data successfuly loaded and parsed');
        engine.startDoomLoop();
        this.log('doom loop started');
        this.enterLevel();
    }

    /**
     * does something special (and synchronous) each time a level is loaded. activates pointerlock.
     */
    enterLevel() {
        this.log('entering level');
        if (this._options.pointerlock) {
            this.setMouseSensitivity(this._options.mouseSensitivity);
            this._screen.pointerlock.enable();
        }
    }

    async run() {
        this.log('starting game engine');
        this._runCalled = true;
        this.init();
        await this.initAsync();
        if (this._options.autoload) {
            const aLevels = await fetchJSON(this._options.fetchLevelListAction);
            const aExpLevels = aLevels.filter(level => level.exported);
            const level = aExpLevels.shift();
            if (!!level) {
                try {
                    this.log('autoloading level', level.name);
                    const oLevelData = await fetchJSON(this.options.fetchLevelAction.replace(/:name/, level.name))
                    await this.buildLevel(oLevelData);
                    this.log('level', level.name, 'successfully loaded');
                } catch (e) {
                    console.error(e);
                    this.displayMessage('Error: ' + e.message);
                }
            } else {
                this.displayMessage('Error: There is no published level !');
            }
        }
    }
}

export default GameAbstract;
