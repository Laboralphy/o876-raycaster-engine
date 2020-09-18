import * as CONSTS from './consts';
import * as LOGIC_MUTATIONS from './store/modules/logic/mutation-types';
import GameAbstract from 'libs/game-abstract';
import {quoteSplit} from "libs/quote-split";
import UI from './UI';
import Logic from './Logic';
import Scripts from './scripts';
import FadeIn from "libs/engine/filters/FadeIn";
import Flash from "libs/engine/filters/Flash";
import Halo from "libs/engine/filters/Halo";
import Timed from "libs/engine/filters/Timed";
import CameraObscura from "./filters/CameraObscura";
import GhostScreamer from "./filters/GhostScreamer";
import RedHaze from "./filters/RedHaze";
import Position from "libs/engine/Position";
import Index from "libs/geometry";
import ObjectExtender from "libs/object-helper/Extender";

import THINKERS from './thinkers';
import CanvasHelper from "libs/canvas-helper";
import Album from "./Album";
import SenseMap from "./SenseMap";

class Game extends GameAbstract {
    init() {
        this._debug = true;
        super.init();
        this.log('initialize user interface')
        this._ui = new UI('#vue-application');
        this.log('initialize game logic and state')
        this._logic = new Logic(this._ui.store);
        this._album = new Album(this._ui.store);
        this.log('load state data');
        this.logic.loadData();
        this.log('initialize event handlers');
        this.engine.events.on('update', () => this.engineUpdateHandler());
        this.engine.events.on('entity.destroyed', ({entity}) => this.engineEntityDestroyedHandler(entity));
        this.engine.events.on('option.changed', ({key, value}) => this.engineOptionChanged(key, value));
        this.initGlobalTagHandlers();
        this.log('initialize thinkers');
        this.engine.useThinkers(THINKERS, {game: this});
        this.initScreenHandler();
        this._locators = {};
        this._activeGhosts = [];
        this.log('initializing common visual filters');
        this._cameraFilter = new CameraObscura();
        this.engine.filters.link(this._cameraFilter);
        this._haloBlack = new Halo('black');
        this.engine.filters.link(this._haloBlack);
        this._ghostScream = new GhostScreamer();
        this.engine.filters.link(this._ghostScream);
        this._senseMap = new SenseMap();
        this._capturableEntities = null;
    }

    async initAsync() {
        await super.initAsync();
        await this.loadLevel('mans-cabin');
    }


    async loadLevel(sLevel, extra) {
        await super.loadLevel(sLevel, extra);
        this._cameraFilter.assignAssets({
            visor: this.engine.getTileSet('u_visor'),
            lamp: this.engine.getTileSet('u_lamp')
        });
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

    get album() {
        return this._album;
    }

//
//                        _       _             __
//  _   _ ___  ___ _ __  (_)_ __ | |_ ___ _ __ / _| __ _  ___ ___
// | | | / __|/ _ \ '__| | | '_ \| __/ _ \ '__| |_ / _` |/ __/ _ \
// | |_| \__ \  __/ |    | | | | | ||  __/ |  |  _| (_| | (_|  __/
//  \__,_|___/\___|_|    |_|_| |_|\__\___|_|  |_|  \__,_|\___\___|
//
    dimSurface() {
        const oSurface = this.screen.surface;
        oSurface.classList.add('dimmed');
    }

    undimSurface() {
        const oSurface = this.screen.surface;
        oSurface.classList.remove('dimmed');
    }

    /**
     * Called when the user enters UI mode by exiting FPS Mode
     */
    enterUI() {
        this.engine.stopDoomLoop();
        this.ui.show();
        this.dimSurface();
    }

    /**
     * Called when the user exits UI mode and enters FPS Mode
     */
    exitUI() {
        this.engine.startDoomLoop();
        this.ui.hide();
        this.undimSurface();
    }


//                       _                                                                 _
//   _____   _____ _ __ | |_   _ __ ___   __ _ _ __   __ _  __ _  ___ _ __ ___   ___ _ __ | |_
//  / _ \ \ / / _ \ '_ \| __| | '_ ` _ \ / _` | '_ \ / _` |/ _` |/ _ \ '_ ` _ \ / _ \ '_ \| __|
// |  __/\ V /  __/ | | | |_  | | | | | | (_| | | | | (_| | (_| |  __/ | | | | |  __/ | | | |_
//  \___| \_/ \___|_| |_|\__| |_| |_| |_|\__,_|_| |_|\__,_|\__, |\___|_| |_| |_|\___|_| |_|\__|
//                                                         |___/

    /**
     * Synchronisation des données de l'engine avec le store
     */
    engineUpdateHandler() {
        this.computeCapturableEntities();
        // checks for camera energy
        if (this.isCameraRaised()) {
            this.logic.updateCameraEnergy(this.capturableEntities, this.isAimingCellSupernatural());
            this.syncCameraStore();
        }
        this.computeSupernaturalCloseness();
    }

    /**
     * init screen event handlers
     */
    initScreenHandler() {
        this.log('init screen handler');
        this.screen.on('pointerlock.exit', () => {
            this.enterUI();
        });
        this.screen.on('pointerlock.enter', () => {
            this.exitUI();
        });
    }

    engineEntityDestroyedHandler(entity) {
        const sType = entity.data.type;
        if (sType === 'w' || sType === 'v') {
            const i = this._activeGhosts.indexOf(entity);
            if (i >= 0) {
                this._activeGhosts.splice(i, 1);
            }
        }
        this.triggerEntityEvent(entity, 'death');
    }

    engineOptionChanged(key, value) {
        switch (key) {
            case 'screen.width':
                this.logic.updateCameraWidth(value);
        }
    }

    triggerEntityEvent(entity, sEvent, ...args) {
        const oEvents = entity.data.events;
        if ((typeof oEvents === 'object') && (sEvent in oEvents)) {
            this.runScript(oEvents[sEvent], entity, ...args);
        }
    }




//                _       _
//  ___  ___ _ __(_)_ __ | |_ ___
// / __|/ __| '__| | '_ \| __/ __|
// \__ \ (__| |  | | |_) | |_\__ \
// |___/\___|_|  |_| .__/ \__|___/
//                 |_|
    runScript(sName, ...params) {
        let script = null;
        try {
            script = ObjectExtender.objectGet(Scripts, sName);
        } catch (e) {
            return;
        }
        if (typeof script === 'function') {
            return script(this, ...params);
        }
        if (typeof script === 'object' && 'main' in script && typeof script.main === 'function') {
            return script.main(this, ...params);
        }
        // throw new ReferenceError('Unable to run script : "' + sName + '". No published function.');
    }

//            _                 _          _                  _   _               _
//   _____  _| |_ ___ _ __   __| | ___  __| |  _ __ ___   ___| |_| |__   ___   __| |___
//  / _ \ \/ / __/ _ \ '_ \ / _` |/ _ \/ _` | | '_ ` _ \ / _ \ __| '_ \ / _ \ / _` / __|
// |  __/>  <| ||  __/ | | | (_| |  __/ (_| | | | | | | |  __/ |_| | | | (_) | (_| \__ \
//  \___/_/\_\\__\___|_| |_|\__,_|\___|\__,_| |_| |_| |_|\___|\__|_| |_|\___/ \__,_|___/

    enterLevel() {
        super.enterLevel();
        this._senseMap.init(this.engine.raycaster.getMapSize());
        this.initTagHandlers();
        this._senseMap.computeMap();
        this.engine.filters.link(new FadeIn({duration: 600}));
    }

    keyDownHandler(key) {
        super.keyDownHandler(key);
        this.runScript('key.' + key.toLowerCase() + '.keydown');
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
        const cf = this._cameraFilter;
        const e = cf.energy;
        e.current = this.logic.prop('getCameraEnergy');
        e.max = this.logic.prop('getCameraEnergyMax');
        e.forcePulse = this.logic.prop('isCameraAimingSupernatural');
        //cf.lampIntensity = this.logic.prop('getCameraSensorLamp');
    }

    /**
     * Renvoie la référence du tag photo de la cellule actuellemenbt visée en mode photo
     */
    getAimedCellPhotoTags() {
        const engine = this.engine;
        const oAimedCell = engine.raycaster.aimedCell;
        let aPhotos = null;
        if (('xCell' in oAimedCell) && ('yCell' in oAimedCell)) {
            const p = engine.camera.position;
            const d = Index.distance(p.x, p.y, oAimedCell.x, oAimedCell.y);
            if (d <= CONSTS.CAMERA_EXAMINATION_RANGE) {
                const x = oAimedCell.xCell;
                const y = oAimedCell.yCell;
                const tagGrid = engine.tagManager.grid;
                const aTags = tagGrid.cell(x, y);
                aTags.forEach(id => {
                    const tags = tagGrid.getTagCommand(id);
                    const [command, ref] = tags;
                    if (command === 'photo') {
                        if (aPhotos === null) {
                            aPhotos = [];
                        }
                        aPhotos.push({ref, id, x, y});
                    }
                });
            }
        }
        return aPhotos;
    }

    isAimingCellSupernatural() {
        return this.getAimedCellPhotoTags() !== null;
    }

    /**
     * Renvoie la valeur de prochitude d'un évènement surnaturel
     * return {number}
     */
    computeSupernaturalCloseness() {
        // déterminer les évènement surnaturel et leur distance
        // réduire la liste à 3 éléments max
        const xPlayer = this.player.sector.x;
        const yPlayer = this.player.sector.y;
        const fLightSM = this._senseMap.getSenseAt(xPlayer, yPlayer);
        // déterminer la présence de spectres
        let fLightCE = 0;
        if (this.capturableEntities.length > 0) {
            const e = this
                .capturableEntities
                .sort((a, b) => b.value - a.value);
            const {precision, proximity} = e[0];
            fLightCE = (proximity + precision) / 2;
        }
        this._cameraFilter.lampIntensity = Math.max(fLightSM, fLightCE);
    }

    /**
     * checks if a "photo" tagged cell is currently aimed
     * if so, triggers the corresponding script
     */
    execAimedCellPhotoScript() {
        const aPhotos = this.getAimedCellPhotoTags();
        if (aPhotos === null) {
            return;
        }
        const oPhotoScripts = Scripts.photo;
        aPhotos.forEach(({ref, id, x, y}) => {
            const remove = () => this.engine.tagManager.grid.removeTag(x, y, id);
            if (ref in oPhotoScripts) {
                oPhotoScripts[ref].main(this, remove, x, y);
            }
        });
    }

    /**
     * stockage d'une photo d'indice
     * @param type
     * @param value
     * @param ref
     * @param oPosition
     * @return {HTMLCanvasElement}
     */
    storePhoto(type, value, ref, oPosition = null) {
        const oPhoto = this.capture(oPosition);
        this.album.storePhoto(oPhoto.toDataURL('image/jpeg'), type, value, ref);
        this.ui.displayPhotoScore(value);
        return oPhoto;
    }

    /**
     * shoot a photo
     */
    triggerCamera() {
        const nLastTime = this.logic.prop('getCameraLastShotTime');
        const nThisTime = this.engine.getTime();
        if ((nThisTime - nLastTime) < CONSTS.CAMERA_RETRIGGER_DELAY) {
            // trop peu de temps depuis la dernière photo
            return;
        }
        // capture screenshot
        this.engine.raycaster.screenshot();
        this.engine.filters.link(new Flash({
            duration: CONSTS.FLASH_DURATION * 2,
            strength: 6
        }));
        this.engine.filters.link(new FadeIn({
            color: 'white',
            duration: CONSTS.FLASH_DURATION / 2
        }));

        this.processCapturedEntities();

        this.logic.commit(LOGIC_MUTATIONS.DEPLETE_ENERGY);
        // pour tous les fantomes present dans la ligne de mire
        // appliquer un filter ghostshot
        // calculer les dégats
        // lancer des script pour les spectres
        this.execAimedCellPhotoScript();
        this.logic.commit(LOGIC_MUTATIONS.SHOOT, {time: nThisTime});
    }

    /**
     * dresse la liste des entité capturable (fantome et spectre)
     */
    computeCapturableEntities() {
        this._computeCapturableEntities = this
            ._activeGhosts
            .map(entity => this.logic.getGhostScore(entity));
    }

    get capturableEntities() {
        return this._computeCapturableEntities;
    }

    /**
     * Parcoure la liste des entity dans le champ de vision.
     * Effectue un traitement spécifique à chaque type d'entité
     * Pour chaque entité :
     * 1) verifier le type
     * 2) composer et afficher le détail des scores
     * 3) déclencher l'évènement de capture
     */
    processCapturedEntities() {
        // checks if ghost or wraith are in visibility
        const aGhostDetails = {
            value: 0,
            energy: this.logic.prop('getCameraEnergy'),
            distance: Infinity,
            angle: Infinity,
            targets: 0,
            shutter: false,
            damage: 0,
        };
        this
            .capturableEntities
            .filter(({value}) => value > 0)
            .forEach(({entity, value, precision, distance}) => {
                switch (entity.data.type) {
                    case 'w':
                        this._ghostScream.addGhost(entity);
                        this.wraithShot(entity, value);
                        break;

                    case 'v':
                        this._ghostScream.addGhost(entity);
                        aGhostDetails.damage += this.ghostShot(entity, value);
                        aGhostDetails.value += Math.round(entity.data.score * value);
                        aGhostDetails.distance = Math.min(aGhostDetails.distance, distance);
                        aGhostDetails.angle = Math.min(aGhostDetails.angle, precision);
                        ++aGhostDetails.targets;
                        break;
                }
            });
        if (aGhostDetails.targets > 0) {
            this.ui.displayPhotoDetailScore(aGhostDetails);
        }
    }

    wraithShot(entity, fScore) {
        entity.data.shot = true;
        this.storePhoto(
            CONSTS.PHOTO_TYPE_WRAITH, // type de photo
            Math.round(entity.data.wraith.score * fScore), // score de la photo
            entity.ref,               // information supplémentaire (titre, description)
        );
    }

    ghostShot(entity, fScore) {
        const nDamage = this.logic.damageGhost(entity, fScore);
        if (nDamage > 0) {
            this.triggerEntityEvent(entity, 'damaged', nDamage);
        }
        return nDamage;
    }

    /**
     * switch form game/camera mode
     */
    toggleCamera() {
        if (this.isCameraRaised()) {
            this.dropCamera();
        } else {
            this.raiseCamera();
        }
    }

    /**
     * show camera interface and go to camera navigation mode
     */
    raiseCamera() {
        if (this.isCameraRaisable()) {
            this.logic.commit(LOGIC_MUTATIONS.DEPLETE_ENERGY);
            const oCamera = this.engine.camera;
            oCamera.data.camera = true;
            oCamera.thinker.setWalkingSpeed(CONSTS.PLAYER_CAMERA_SPEED);
            this._cameraFilter.show();
            this.syncCameraStore();
        }
    }

    /**
     * hide camera interface and go back to game navigation mode
     */
    dropCamera() {
        const oCamera = this.engine.camera;
        oCamera.data.camera = false;
        oCamera.thinker.setWalkingSpeed(CONSTS.PLAYER_FULL_SPEED);
        this._cameraFilter.hide();
        this.logic.shutdownCameraIndicators();
        this.syncCameraStore();
    }

    /**
     * returns true if the camera is currently raised
     * @returns {boolean}
     */
    isCameraRaised() {
        return this._cameraFilter.isVisible();
    }

    /**
     * return true if the camera can be raised at the present moment
     * @returns {boolean}
     */
    isCameraRaisable() {
        return !this.isPlayerFrozen();
    }

    /**
     * Captures an image at the given location (player location by default)
     * @param pos {Position}
     * @returns {HTMLCanvasElement} image (jpeg)
     */
    capture(pos = null) {
        // creation d'une capture
        if (pos === null) {
            pos = this.engine.camera.position;
        }
        const oScreenShot = this.engine.screenshot(pos.x, pos.y, pos.angle, pos.z);
        const photo = CanvasHelper.createCanvas(CONSTS.PHOTO_ALBUM_WIDTH, CONSTS.PHOTO_ALBUM_HEIGHT);
        const ctx = photo.getContext('2d');
        const sw =  oScreenShot.width;
        const sh =  oScreenShot.height;
        const dw =  photo.width;
        const dh =  photo.height;
        const dx = 0;
        const dy = 0;
        const sx = (sw - dw) >> 1;
        const sy = (sh - dh) >> 1;
        ctx.drawImage(
            oScreenShot,
            sx, sy, dw, dh,
            dx, dy, dw, dh
        );
        return photo;
    }

    /**
     * Freeze all player actions and movement
     */
    freezePlayer() {
        this.engine.camera.thinker.frozen = true;
    }

    /**
     * unfreeze player
     */
    thawPlayer() {
        this.engine.camera.thinker.frozen = false;
    }

    /**
     * returns true if player commands are frozen (keys + mouse)
     * @return {boolean}
     */
    isPlayerFrozen() {
        return this.engine.camera.thinker.frozen;
    }

    get player() {
        return this.engine.camera;
    }

    /**
     * A ghost is attacking player
     * applying wound on player
     * applying visual effect
     */
    commitGhostAttack(oGhost, oTarget) {
        if (oTarget === this.player) {
            // get ghost power
            this.logic.damagePlayer(oGhost);
            const oThinker = this.player.thinker;
            oThinker.ghostThreat(oGhost);
            // filtre visuel
            const oFilter = new Timed({
                child: new RedHaze(),
                duration: 750
            });
            this.engine.filters.link(oFilter);
            if (this.logic.isPlayerDead()) {
                oThinker.kill();
                this.freezePlayer();
            }
        }
    }

//  _                _                   _        _   _
// | | _____   _____| |  _ __ ___  _   _| |_ __ _| |_(_) ___  _ __  ___
// | |/ _ \ \ / / _ \ | | '_ ` _ \| | | | __/ _` | __| |/ _ \| '_ \/ __|
// | |  __/\ V /  __/ | | | | | | | |_| | || (_| | |_| | (_) | | | \__ \
// |_|\___| \_/ \___|_| |_| |_| |_|\__,_|\__\__,_|\__|_|\___/|_| |_|___/

    /**
     * Spawns a ghost at the given cell coordinates
     * @param sRef {string} ghsot reference id
     * @param xCell {number|string}
     * @param [yCell] [{number}
     * @returns {Entity}
     */
    spawnGhost(sRef, xCell, yCell = undefined) {
        const oGhost = yCell === undefined && (typeof xCell === 'string')
            ? this.engine.createEntity(sRef, this.getLocator(xCell).position)
            : this.engine.createEntity(sRef, new Position(this.engine.getCellCenter(xCell, yCell)));
        this._activeGhosts.push(oGhost);
        oGhost.thinker.target = this.player;
        oGhost.data.events = {
            death: null,
            attack: null,
            damaged: null
        }
        return oGhost;
    }





//      _                _                                  _   _
//   __| | ___  ___ __ _| |___    ___  _ __   ___ _ __ __ _| |_(_) ___  _ __  ___
//  / _` |/ _ \/ __/ _` | / __|  / _ \| '_ \ / _ \ '__/ _` | __| |/ _ \| '_ \/ __|
// | (_| |  __/ (_| (_| | \__ \ | (_) | |_) |  __/ | | (_| | |_| | (_) | | | \__ \
//  \__,_|\___|\___\__,_|_|___/  \___/| .__/ \___|_|  \__,_|\__|_|\___/|_| |_|___/
//                                    |_|


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
        csm.rotateWallSurfaces(x, y, bClockWise);
    }




//  _                                           _   _
// | |_ __ _  __ _    ___  _ __   ___ _ __ __ _| |_(_) ___  _ __  ___
// | __/ _` |/ _` |  / _ \| '_ \ / _ \ '__/ _` | __| |/ _ \| '_ \/ __|
// | || (_| | (_| | | (_) | |_) |  __/ | | (_| | |_| | (_) | | | \__ \
//  \__\__,_|\__, |  \___/| .__/ \___|_|  \__,_|\__|_|\___/|_| |_|___/
//           |___/        |_|

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
                tag: quoteSplit(tg.getTag(t)),
                id: t
            }));
        });
        return aTags;
    }

    initGlobalTagHandlers() {
        /**
         * ee = event _events
         * @type {EventEmitter|module:events.internal|EventEmitter|number|ASTElementHandlers}
         */
        this.logGroup('initialize global tag handlers')
        const oScriptActions = Scripts.tag;
        const ee = this.engine.events;
        const actions = ['push', 'enter', 'exit'];
        for (let s in oScriptActions) {
            const script = oScriptActions[s];
            actions.forEach(a => {
                // "a" vaut 'push', 'enter', 'exit'
                if (a in script) {
                    this.log('script', s, a);
                    ee.on('tag.' + s + '.' + a,({entity, x, y, parameters, remove}) => {
                        if (entity === this.player) {
                            script[a](this, remove, x, y, ...parameters)
                        }
                    });
                }
            });
        }
        this.logGroupEnd();
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
        this.logGroup('initialize level tag handlers')
        this.log('calling init on each tag scripts');
        const aDeleted = [];
        this.getTags().forEach(({id, tag, x, y}) => {
            const sCommand = tag[0];
            try {
                const parameters = tag.slice(1);
                this.runScript('tag.' + sCommand + '.init', function () {
                    aDeleted.push({x, y, id});
                }, x, y, ...parameters);
            } catch (e) {
                // this tag has no init "script"
                console.error(e);
            }
        });
        aDeleted.forEach(({x, y, id}) => {
            this.engine.tagManager.grid.removeTag(x, y, id);
        });
        this.logGroupEnd();
    }

    getLocator(sRef) {
        if (sRef in this._locators) {
            return this._locators[sRef];
        } else {
            throw new Error('invalid locator reference : "' + sRef + '"');
        }
    }

    /**
     * Remove a "sense" tag.
     * Sense tags are use to light on camera filament.
     * When a mystery is solved, the corresponding supernatural sense tag is no longer needed and is removed
     * @param sRef {string}
     */
    removeSenseTag(sRef) {
        this._senseMap.removeSense(sRef);
    }
}

export default Game;