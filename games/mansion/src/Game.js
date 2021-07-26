import * as CONSTS from './consts';
import GameAbstract from 'libs/game-abstract';
import {quoteSplit} from "libs/quote-split";
import UI from './UI';
import Logic from './Logic';
import Visor from './Visor';
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

import DATA from '../assets/data';
import GameOver from './filters/GameOver'

class Game extends GameAbstract {
    init() {
        this._debug = true;
        this._compiledBlueprints = null;
        super.init();
        this.log('initialize user interface')
        this._ui = new UI('#vue-application');
        this.log('initialize game logic and state')
        this._logic = new Logic(this._ui.store);
        this._album = new Album(this._ui.store);
        this._visor = new Visor(this._ui.store);
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
        this._mutations = {
            decals: [],
            level: ''
        }
        this._levelStates = {}
        this.ui.store.watch(
            (state, getters) => getters['ui/isGameRunning'],
            (newValue, oldValue) => {
                if (newValue && !oldValue) {
                  this.loadLevel(CONSTS.FIRST_LEVEL);
                }
            }
        )
    }

    async initAsync() {
        await super.initAsync();
    }

    getCompiledBlueprints() {
        if (this._compiledBlueprints) {
            return this._compiledBlueprints;
        }
        const bp = DATA.BLUEPRINTS;
        const oGhosts = DATA.GHOSTS;
        // patch blueprints
        for (let sGhostId in oGhosts) {
            const gi = oGhosts[sGhostId];
            const oGhostBlueprint = {
                id: sGhostId,
                ref: sGhostId,
                tileset: gi.tileset,
                scale: 3,
                size: 24,
                fx: ["@FX_LIGHT_ADD", "@FX_LIGHT_SOURCE"],
                thinker: gi.thinker,
                data: { ...gi, type: 'v' }
            };
            delete oGhostBlueprint.data.thinker;
            bp.push(oGhostBlueprint);
        }
        this._compiledBlueprints = bp;
        return bp;
    }

    /**
     * @override
     * @param sLevel {string}
     * @param extra
     * @returns {Promise<void>}
     */
    async loadLevel(sLevel, extra = {}) {
        // save current level state
        if (this._mutations.level !== '') {
            this.log('save current level state', this._mutations.level);
            this._levelStates[this._mutations.level] = this.getLevelState();
        }
        // fetching data and completing blueprints
        extra.tilesets = DATA.TILESETS;
        extra.blueprints = this.getCompiledBlueprints();
        this._mutations.decals = [];
        this._mutations.level = sLevel;
        const oLevelData = require(__dirname + '/../assets/levels/' + sLevel + '.json');
        await this.buildLevel(oLevelData, extra);
        this._cameraFilter.assignAssets({
            visor: this.engine.getTileSet('u_visor'),
            lamp: this.engine.getTileSet('u_lamp')
        });
        this.visor.setShootLastTime(0);
        // restore new level state (if defined)
        if (sLevel in this._levelStates) {
            this.log('restore level state', sLevel);
            this.setLevelState(this._levelStates[sLevel]);
        }
    }


//      _                _                                  _   _
//   __| | ___  ___ __ _| |___    ___  _ __   ___ _ __ __ _| |_(_) ___  _ __  ___
//  / _` |/ _ \/ __/ _` | / __|  / _ \| '_ \ / _ \ '__/ _` | __| |/ _ \| '_ \/ __|
// | (_| |  __/ (_| (_| | \__ \ | (_) | |_) |  __/ | | (_| | |_| | (_) | | | \__ \
//  \__,_|\___|\___\__,_|_|___/  \___/| .__/ \___|_|  \__,_|\__|_|\___/|_| |_|___/
//                                    |_|

    setDecalState(value) {
        value.forEach(mut => {
           switch (mut.op) {
               case 'del':
                   this.removeDecals(mut.x, mut.y, mut.sides);
                   break;

               case 'rot':
                   this.rotateDecals(mut.x, mut.y, mut.cw);
                   break;

               case 'app':
                   this.applyDecal(mut.x, mut.y, mut.sides, mut.ref);
                   break;
           }
        });
    }

    getDecalState() {
        return this._mutations.decals;
    }

    /**
     * Remove all decals from a block
     * @param x {number} block cell coordinate (x axis)
     * @param y {number} block cell coordinate (y axis)
     * @param nSides {number} bit mask of affected sides
     */
    removeDecals(x, y, nSides = 0xF) {
        this._mutations.decals.push({op: 'del', x, y, sides: nSides});
        const csm = this.engine.raycaster._csm;
        for (let i = 0; i < 4; ++i) {
            if ((nSides & (1 << i)) !== 0) {
                csm.removeDecal(x, y, i);
            }
        }
    }

    /**
     * Rotates all decals on a block
     * @param x {number} block cell coordinate (x axis)
     * @param y {number} block cell coordinate (y axis)
     * @param bClockWise {boolean} true = clock wise ; false = counter clock wise (default)
     */
    rotateDecals(x, y, bClockWise) {
        this._mutations.decals.push({op: 'rot', x, y, cw: bClockWise});
        const csm = this.engine.raycaster._csm;
        csm.rotateWallSurfaces(x, y, bClockWise);
    }

    /**
     * Applies a decal on a surface
     * @param x
     * @param y
     * @param nSides
     * @param sRef
     */
    applyDecal(x, y, nSides, sRef) {
        this._mutations.decals.push({op: 'app', x, y, sides: nSides, ref: sRef});
        const oDecal = this.engine.getTileSet(sRef);
        const csm = this.engine.raycaster._csm;
        for (let i = 0; i < 4; ++i) {
            if ((nSides & (1 << i)) !== 0) {
                csm.setDecal(x, y, i, oDecal.getImage());
            }
        }
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

    get visor() {
        return this._visor;
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
        if (!this.logic.isPlayerDead()) {
            this.engine.stopDoomLoop();
            this.ui.show();
            this.dimSurface();
        }
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
        // checks for visor energy
        if (this.isCameraRaised()) {
            this.visor.updateCameraEnergy(this.capturableEntities, this.isAimingCellSupernatural());
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
                this.visor.updateCameraWidth(value);
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
     * sync visor energy property with store
     */
    syncCameraStore() {
        const cf = this._cameraFilter;
        const e = cf.energy;
        e.current = this.visor.energy;
        e.max = this.visor.energyMax;
        e.forcePulse = this.visor.aimingSupernatural;
        //cf.lampIntensity = this.visor.prop('getCameraSensorLamp');
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

    /**
     * Renvoie true si on est en train de viser un fantome dont le shutter chance est actif
     */
    isAimingShutterChance () {
        // il faut au moins un fantome

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
        let bShutterChance = false;
        const ce = this.capturableEntities;
        if (ce.length > 0) {
            const e = ce.sort((a, b) => b.value - a.value);
            const {precision, proximity} = e[0];
            fLightCE = (proximity + precision) / 2;
            // checks shutters chances
            bShutterChance = ce.some(({ entity }) => entity.data.type === "v" && entity.thinker.shutterChance);
        }
        // allumer le filament en précence de fantome
        const cf = this._cameraFilter;
        cf.lampIntensity = Math.max(fLightSM, fLightCE);
        cf.critical = bShutterChance;
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
        const nLastTime = this.visor.lastShotTime;
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

        this.visor.depleteEnergy();
        // pour tous les fantomes present dans la ligne de mire
        // appliquer un filter ghostshot
        // calculer les dégats
        // lancer des script pour les spectres
        this.execAimedCellPhotoScript();
        this.visor.setShootLastTime(nThisTime);
    }

    /**
     * dresse la liste des entité capturable (fantome et spectre)
     */
    computeCapturableEntities() {
        this._capturableEntities = this
            ._activeGhosts
            .map(entity => this.visor.getGhostScore(entity));
    }

    get capturableEntities() {
        return this._capturableEntities;
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
        const oGhostDetails = {
            value: 0,
            energy: this.visor.energy,
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
                        oGhostDetails.damage += this.ghostShot(entity, value);
                        oGhostDetails.value += Math.round(entity.data.score * value);
                        oGhostDetails.distance = Math.min(oGhostDetails.distance, distance);
                        oGhostDetails.angle = Math.min(oGhostDetails.angle, precision);
                        oGhostDetails.shutter = entity.thinker.shutterChance;
                        ++oGhostDetails.targets;
                        break;
                }
            });
        if (oGhostDetails.targets > 0) {
            this.ui.displayPhotoDetailScore(oGhostDetails);
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
        // initial damage based on visor accuracy
        const nDamage = this.visor.damageGhost(entity, fScore);
        // modified damage based on player attributes
        // ...
        if (nDamage > 0) {
            this.triggerEntityEvent(entity, 'damaged', nDamage);
        } else if (isNaN(nDamage)) {
            throw new RangeError('damage calculation error')
        }
        return nDamage;
    }

    /**
     * switch form game/visor mode
     */
    toggleCamera() {
        if (this.isCameraRaised()) {
            this.dropCamera();
        } else {
            this.raiseCamera();
        }
    }

    /**
     * show visor interface and go to visor navigation mode
     */
    raiseCamera() {
        if (this.isCameraRaisable()) {
            this.visor.depleteEnergy();
            const oCamera = this.engine.camera;
            oCamera.data.camera = true;
            oCamera.thinker.setWalkingSpeed(CONSTS.PLAYER_CAMERA_SPEED);
            this._cameraFilter.show();
            this.syncCameraStore();
        }
    }

    /**
     * hide visor interface and go back to game navigation mode
     */
    dropCamera() {
        const oCamera = this.engine.camera;
        oCamera.data.camera = false;
        oCamera.thinker.setWalkingSpeed(CONSTS.PLAYER_FULL_SPEED);
        this._cameraFilter.hide();
        this.visor.shutdownCameraIndicators();
        this.syncCameraStore();
    }

    /**
     * returns true if the visor is currently raised
     * @returns {boolean}
     */
    isCameraRaised() {
        return this._cameraFilter.isVisible();
    }

    /**
     * return true if the visor can be raised at the present moment
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
        const sw = oScreenShot.width;
        const sh = oScreenShot.height;
        const dw = photo.width;
        const dh = photo.height;
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
                this.gameOver();
            }
        }
    }

    gameOver () {
        this.player.thinker.kill();
        this.freezePlayer();
        this.engine.delayCommand(() => {
            // fading out
            this.engine.filters.link(new GameOver());
            this.screen.disablePointerLock();
            this.ui.commit('SET_GAME_OVER_PROMPT_VISIBLE', { value: true });
        }, 1500);
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
        tg.iterate((x, y) => { // iterates all cells of the tag grid
            aTags.push(...this.getTagsAt(x, y));
        });
        return aTags;
    }

    getTagsAt(x, y) {
      const tg = this.engine._tm._tg;
      const cell = tg.cell(x, y);
      const a = []
      cell.forEach(t => {
          a.push({
          x, y,
          tag: quoteSplit(tg.getTag(t)),
          id: t,
          remove: () => {
              console.log('removing tag id', t, tg.getTag(t), 'at', x, y)
              tg.removeTag(x, y, t)
          }
        })
      });
      return a;
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
                    ee.on('tag.' + s + '.' + a, ({entity, x, y, parameters, remove}) => {
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

    /**
     * Retrieves a locator by its reference
     * @param sRef {string}
     * @return {*}
     */
    getLocator(sRef) {
        if (sRef in this._locators) {
            return this._locators[sRef];
        } else {
            throw new Error('invalid locator reference : "' + sRef + '"');
        }
    }

    /**
     * Somes places make the camera filament glowing, this occurs when a supernatural event is about to occurs.
     * When a mystery is solved, the corresponding supernatural spot is no longer needed and is removed with this function
     * @param sRef {string}
     */
    removeSense(sRef) {
        this._senseMap.removeSense(sRef);
    }

    getLevelState() {
        const {doors, locks, tags, time} = this.engine.getEngineState();
        const decals = this.getDecalState();
        const senses = this._senseMap.state;
        return {
            time,
            tags,
            doors,
            locks,
            decals,
            senses
        };
    }

    setLevelState({ tags, doors, locks, decals, senses, time }) {
        this.engine.setEngineState({doors, locks, tags, time});
        this.setDecalState(decals);
        this._senseMap.state = senses
    }
}

export default Game;
