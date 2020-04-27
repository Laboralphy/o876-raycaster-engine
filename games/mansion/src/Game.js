import * as CONSTS from './consts';
import * as MUTATIONS from './store/modules/logic/mutation-types';
import GameAbstract from 'libs/game-abstract';
import {quoteSplit}  from "libs/quote-split";
import UI from './UI';
import Logic from './Logic';
import Scripts from './scripts';
import FadeIn  from "libs/engine/filters/FadeIn";
import Halo  from "libs/engine/filters/Halo";
import CameraObscura from "./filters/CameraObscura";
import Position  from "libs/engine/Position";
import GeometryHelper from "libs/geometry/GeometryHelper";

import THINKERS from './thinkers';

class Game extends GameAbstract {

    // ... write your game here ...
    init() {
        this._debug = true;
        super.init();
        this.log('initialize user interface')
        this._ui = new UI('#vue-application');
        this.log('initialize game logic and state')
        this._logic = new Logic(this._ui.store);
        this.log('load state data')
        this.logic.loadData();
        // this.screen.on('pointerlock.enter', () => this._ui.store.commit('ui/SET_VISIBLE', {value: false}));
        // this.screen.on('pointerlock.exit', () => this._ui.store.commit('ui/SET_VISIBLE', {value: true}));
        this.log('initialize camera visual filter')
        this._cameraFilter = new CameraObscura();
        this.log('initialize update event');
        this.engine.events.on('update', () => this.engineUpdateHandler());
        this.log('initialize thinkers');
        this.engine.useThinkers(THINKERS);
    }

//
//  _           _                                    _   _
// (_)_ __  ___| |_ __ _ _ __   ___ ___    __ _  ___| |_| |_ ___ _ __ ___
// | | '_ \/ __| __/ _` | '_ \ / __/ _ \  / _` |/ _ \ __| __/ _ \ '__/ __|
// | | | | \__ \ || (_| | | | | (_|  __/ | (_| |  __/ |_| ||  __/ |  \__ \
// |_|_| |_|___/\__\__,_|_| |_|\___\___|  \__, |\___|\__|\__\___|_|  |___/
//                                        |___/

    get ui() {
        return this._ui;
    }

    get logic() {
        return this._logic;
    }


//                       _                                                                 _
//   _____   _____ _ __ | |_   _ __ ___   __ _ _ __   __ _  __ _  ___ _ __ ___   ___ _ __ | |_
//  / _ \ \ / / _ \ '_ \| __| | '_ ` _ \ / _` | '_ \ / _` |/ _` |/ _ \ '_ ` _ \ / _ \ '_ \| __|
// |  __/\ V /  __/ | | | |_  | | | | | | (_| | | | | (_| | (_| |  __/ | | | | |  __/ | | | |_
//  \___| \_/ \___|_| |_|\__| |_| |_| |_|\__,_|_| |_|\__,_|\__, |\___|_| |_| |_|\___|_| |_|\__|
//                                                         |___/

    engineUpdateHandler() {
        // checks for camera energy
        if (this.isCameraRaised()) {
            // if ghost
            const bGhost = true;
            this.logic.commit(bGhost ? MUTATIONS.INC_ENERGY : MUTATIONS.DEPLETE_ENERGY);
            this.syncCameraStore();
        } else {
        }
    }


//            _                 _          _                  _   _               _
//   _____  _| |_ ___ _ __   __| | ___  __| |  _ __ ___   ___| |_| |__   ___   __| |___
//  / _ \ \/ / __/ _ \ '_ \ / _` |/ _ \/ _` | | '_ ` _ \ / _ \ __| '_ \ / _ \ / _` / __|
// |  __/>  <| ||  __/ | | | (_| |  __/ (_| | | | | | | |  __/ |_| | | | (_) | (_| \__ \
//  \___/_/\_\\__\___|_| |_|\__,_|\___|\__,_| |_| |_| |_|\___|\__|_| |_|\___/ \__,_|___/

    enterLevel() {
        super.enterLevel();
        this.initTagHandlers();
        this.engine.filters.link(this._cameraFilter);
        this.engine.filters.link(new Halo('black'));
        this.engine.filters.link(new FadeIn({duration: 600}));
    }

    keyDownHandler(key) {
        super.keyDownHandler(key);
        // manage the camera
        switch (key) {
            case 'Mouse0':
                if (this.isCameraRaised()) {
                    this.flashCamera();
                }
                break;

            case 'Mouse2':
                this.toggleCamera();
                break;
        }
    }

//        _                                    _   _
//  _ __ | | __ _ _   _  ___ _ __    __ _  ___| |_(_) ___  _ __  ___
// | '_ \| |/ _` | | | |/ _ \ '__|  / _` |/ __| __| |/ _ \| '_ \/ __|
// | |_) | | (_| | |_| |  __/ |    | (_| | (__| |_| | (_) | | | \__ \
// | .__/|_|\__,_|\__, |\___|_|     \__,_|\___|\__|_|\___/|_| |_|___/
// |_|            |___/

    /**
     * sync camera energy property with store
     */
    syncCameraStore() {
        this._cameraFilter.energy.current = this.logic.prop('getPlayerEnergy');
        this._cameraFilter.energy.max = this.logic.prop('getPlayerEnergyMax');
    }

    triggerPhotoShot(x, y) {
        const engine = this.engine;
        const tagGrid = engine.tagManager.grid;
        const aTags = tagGrid.cell(x, y);
        aTags.forEach(id => {
            const tags = tagGrid.getTagCommand(id);
            const [command, item] = tags;
            if (command === 'photo') {
                const oPhotoScripts = Scripts.photos;
                const remove = () => this.engine.tagManager.grid.removeTag(x, y, id);
                if (item in oPhotoScripts) {
                    oPhotoScripts[item].main(this, remove, x, y);
                }
            }
        });
    }

    /**
     * shoot a photo
     */
    flashCamera() {
        this.engine.filters.link(new FadeIn({
            color: 'white',
            duration: CONSTS.FLASH_DURATION
        }));
        this.logic.commit(MUTATIONS.DEPLETE_ENERGY);
        // pour tous les fantomes present dans la ligne de mire
        // appliquer un filter ghostshot
        // calculer les dégats
        // lancer des script pour les spectres

        // tous les blocs possédant un tag "photo" doivent déclencher un event
        const engine = this.engine;
        const oAimedCell = engine.raycaster.aimedCell;
        if (('xCell' in oAimedCell) && ('yCell' in oAimedCell)) {
            const p = engine.camera.position;
            const d = GeometryHelper.distance(p.x, p.y, oAimedCell.x, oAimedCell.y);
            if (d <= CONSTS.CAMERA_EXAMINATION_RANGE) {
                this.triggerPhotoShot(oAimedCell.xCell, oAimedCell.yCell);
            }
        }
    }

    toggleCamera() {
        if (this.isCameraRaised()) {
            this.dropCamera();
        } else {
            this.raiseCamera();
        }
    }

    raiseCamera() {
        if (this.isCameraRaisable()) {
            this.logic.commit(MUTATIONS.DEPLETE_ENERGY);
            const oCamera = this.engine.camera;
            oCamera.data.camera = true;
            oCamera.thinker.setWalkingSpeed(CONSTS.PLAYER_CAMERA_SPEED);
            this._cameraFilter.show();
            this.syncCameraStore();
        }
    }

    dropCamera() {
        const oCamera = this.engine.camera;
        oCamera.data.camera = false;
        oCamera.thinker.setWalkingSpeed(CONSTS.PLAYER_FULL_SPEED);
        this._cameraFilter.hide();
        this.logic.commit(MUTATIONS.DEPLETE_ENERGY);
        this.syncCameraStore();
    }

    isCameraRaised() {
        return this._cameraFilter.isVisible();
    }

    isCameraRaisable() {
        return true;
    }



//  _                _                   _        _   _
// | | _____   _____| |  _ __ ___  _   _| |_ __ _| |_(_) ___  _ __  ___
// | |/ _ \ \ / / _ \ | | '_ ` _ \| | | | __/ _` | __| |/ _ \| '_ \/ __|
// | |  __/\ V /  __/ | | | | | | | |_| | || (_| | |_| | (_) | | | \__ \
// |_|\___| \_/ \___|_| |_| |_| |_|\__,_|\__\__,_|\__|_|\___/|_| |_|___/


    /**
     * Spawns a ghost at the given cell coordinates
     * @param sRef {string} ghsot reference id
     * @param xCell {number}
     * @param yCell {number}
     * @returns {Entity}
     */
    spawnGhost(sRef, xCell, yCell) {
        const engine = this.engine;
        const ps = engine.raycaster.options.metrics.spacing;
        const ps2 = ps >> 1;
        return engine.createEntity(sRef, new Position({x: xCell * ps + ps2, y: yCell * ps + ps2}));
    }


    /**
     * Remove all decals from a block
     * @param x {number} block cell coordinate (x axis)
     * @param y {number} block cell coordinate (y axis)
     */
    removeDecals(x, y) {
        const csm = this.engine.raycaster._csm;
        for (let i = 0; i < 4; ++i) {
            csm.removeDecal(x, y, i);
        }
    }

    /**
     * Rotates all decals on a block
     * @param x {number} block cell coordinate (x axis)
     * @param y {number} block cell coordinate (y axis)
     * @param bClockWise {boolean} true = clock wise ; false = counter clock wise (default)
     */
    rotateDecals(x, y, bClockWise) {
        const csm = this.engine.raycaster._csm;
        csm.rotateWallSurfaces(x, y, !bClockWise);
    }

    /**
     * Adds a tag on a cell
     * @param x {number} cell coordinate (x axis)
     * @param y {number} cell coordinate (y axis)
     * @param sTag {string} complete tag (one string)
     * @return {number} tag identifier (for modification)
     */
    addTag(x, y, sTag) {
        return this.engine._tm._tg.addTag(x, y, sTag);
    }



//  _                                           _   _
// | |_ __ _  __ _    ___  _ __   ___ _ __ __ _| |_(_) ___  _ __  ___
// | __/ _` |/ _` |  / _ \| '_ \ / _ \ '__/ _` | __| |/ _ \| '_ \/ __|
// | || (_| | (_| | | (_) | |_) |  __/ | | (_| | |_| | (_) | | | \__ \
//  \__\__,_|\__, |  \___/| .__/ \___|_|  \__,_|\__|_|\___/|_| |_|___/
//           |___/        |_|
    /**
     * Returns a list of all tags present on the maps, the returns list contains items with these properties :
     * {
     *     x, y, // cell coordinates
     *     tags,  // tag components (space separated values)
     * }
     * @return {array<{tag, x, y}>}
     */
    getTags() {
        const aTags = []; // output list
        const tg = this.engine._tm._tg; // get the tag grid
        tg.iterate((x, y, cell) => { // iterates all cells of the tag grid
            cell.forEach(t => aTags.push({
                x, y,
                tag: quoteSplit(tg.getTag(t))
            }));
        });
        return aTags;
    }

    /**
     * Processes tag initial behavior.
     * Some tags may trigger initial behavior right after level loading.
     * For example, the "lock" tag must trigger a lockDoor() call.
     *
     * Also initialize tag handlers for all tags.
     *
     * the "scripts" folder contains many scripts, each script matches to a set of events.
     * when the event is trigger the matching script is run.
     *
     * example .
     * when 'tag.item.push' is triggered, the script "item" is loaded and the function "item.push()" is called.
     */
    initTagHandlers() {
        const oScriptActions = Scripts.actions;
        this.logGroup('tag handlers')
        this.log('init')
        this.getTags().forEach(({tag, x, y}) => {
            const s = tag[0];
            if (s in oScriptActions) {
                const script = oScriptActions[s];
                if ('init' in script) {
                    let bRemove = false;
                    const pRemove = function () {
                        bRemove = true;
                    };
                    script.init(this, pRemove, x, y)
                }
            }
        });
        /**
         * ee = event emitter
         * @type {EventEmitter|module:events.internal|EventEmitter|number|ASTElementHandlers}
         */
        const ee = this.engine.events;

        const actions = ['push', 'enter', 'exit'];
        for (let s in oScriptActions) {
            const script = oScriptActions[s];
            actions.forEach(a => {
                if (a in script) {
                    this.log('script', s, a)
                    ee.on('tag.' + s + '.' + a,({x, y, parameters, remove}) => script[a](this, remove, x, y, ...parameters));
                }
            });
        }
        this.logGroupEnd();
    }


}

export default Game;