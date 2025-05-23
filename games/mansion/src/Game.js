import * as CONSTS from './consts';
import GameAbstract from 'libs/game-abstract';
import quoteSplit from "libs/quote-split";
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
import AudioManager from "./AudioManager";

import THINKERS from './thinkers';
import CanvasHelper from "libs/canvas-helper";
import Album from "./Album";
import SenseMap from "./SenseMap";

import DATA from '../assets/data';
import GameOver from './filters/GameOver'
import Serializer from "./Serializer";

const {
    AUDIO_EVENT_CAMERA_SHOOT,
    AUDIO_EVENT_CAMERA_CHARGING,
    AUDIO_EVENT_CAMERA_CHARGED,
    AUDIO_EVENT_CAMERA_SUPERNATURAL,
    AUDIO_EVENT_GHOST_ATTACK,
    AUDIO_EVENT_GHOST_DIE,
    AUDIO_EVENT_GHOST_WOUNDED,
    AUDIO_EVENT_GHOST_BURN,
    AUDIO_EVENT_GHOST_SPAWN,
    AUDIO_EVENT_EXPLORE_PICKUP_ITEM,
    AUDIO_EVENT_EXPLORE_DOOR_CLOSE,
    AUDIO_EVENT_EXPLORE_DOOR_OPEN,
    AUDIO_EVENT_EXPLORE_DOOR_LOCKED,
    AUDIO_EVENT_EXPLORE_DOOR_UNLOCK,
    AUDIO_EVENT_AMBIANCE_LOOP,
    AUDIO_EVENT_AMBIANCE_TRIGGER
} = CONSTS

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
        this._audioManager = new AudioManager()
        this._mutations = {
            decals: [],
            level: ''
        }
        this.initEngineEvents()
        this._levelStates = {}
        this.ui.store.watch(
            (state, getters) => getters['ui/isGameRunning'],
            (newValue, oldValue) => {
                if (newValue && !oldValue) {
                    this.loadLevel(this.options.firstLevel);
                }
            }
        )
        this.ui.store.watch(
            (state, getters) => getters['ui/getSettingMouseFactor'],
            (newValue, oldValue) => {
                // 0 => 0.001
                // 100 => 0.1
                this.setMouseSensitivity(Math.max(1, newValue) / 2000)
            }
        )
        this.ui.store.watch(
            (state, getters) => getters['ui/getSettingMusicVolume'],
            (newValue, oldValue) => {
                this._audioManager.setBGMVolume(newValue / 100)
            }
        )
        this.ui.store.watch(
            (state, getters) => getters['ui/getSettingSFXVolume'],
            (newValue, oldValue) => {
                this._audioManager.setSoundVolume(newValue / 100)
            }
        )
    }

    get state () {
        const save = {
            level: Serializer.saveLevelState(this),
            player: Serializer.saveAlbumLogicState(this)
        }
        console.log('saved state', JSON.stringify(save).length, 'bytes')
        return save
    }

    async initAsync() {
        await super.initAsync();
        await this._audioManager.init();
        this._audioManager.setBGMVolume(this.ui.prop('getSettingMusicVolume') / 100)
        this._audioManager.setSoundVolume(this.ui.prop('getSettingSFXVolume') / 100)
        console.log('[g] end if init')
        this.ui.commit('SET_MAIN_MENU_PHASE', { value: 1 })
    }

    getOneGhostData(oData, sGhostId) {
        let gi = {
            ...oData[sGhostId]
        }
        if ('extends' in gi) {
            gi = Object.assign({}, this.getOneGhostData(oData, gi.extends), gi)
            delete gi.extends
        }
        return gi
    }

    getCompiledBlueprints() {
        if (this._compiledBlueprints) {
            return this._compiledBlueprints;
        }
        const bp = DATA.BLUEPRINTS
        const oGhosts = DATA.GHOSTS;
        // patch blueprints
        Object.entries(oGhosts).forEach(([id, g]) => {
            let gi = this.getOneGhostData(oGhosts, id)
            g.id = id
            g.ref = id
            g.tileset = gi.tileset
            g.thinker = gi.thinker
            g.scale = 3
            g.size = 24
            g.fx = ["@FX_LIGHT_ADD", "@FX_LIGHT_SOURCE"]
            g.data = { ...gi, type: 'v' }
            delete g.data.thinker
            bp.push(g)
        })
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
        // Stop all sound
        this._audioManager.stop()
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
        const oFetch = await fetch('assets/levels/' + sLevel + '.json')
        const oLevelData = await oFetch.json()
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
//                   _ _                                                                     _
//    ___ _ __  _ __(_) |_ ___   _ __ ___   __ _ _ __   __ _  __ _  ___ _ __ ___   ___ _ __ | |_
//   / __| '_ \| '__| | __/ _ \ | '_ ` _ \ / _` | '_ \ / _` |/ _` |/ _ \ '_ ` _ \ / _ \ '_ \| __|
//   \__ \ |_) | |  | | ||  __/ | | | | | | (_| | | | | (_| | (_| |  __/ | | | | |  __/ | | | |_
//   |___/ .__/|_|  |_|\__\___| |_| |_| |_|\__,_|_| |_|\__,_|\__, |\___|_| |_| |_|\___|_| |_|\__|
//       |_|                                                 |___/


    /**
     * Supprime le sprite posé au sol à cet endroit
     * @param x
     * @param y
     */
    removeSprite (x, y) {

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
            if (!this.hasRecentlyShot()) {
                const { prev, curr, max } = this.visor.updateCameraEnergy(this.capturableEntities, this.isAimingCellSupernatural());
                if (prev < curr) {
                    if (max) {
                        this.soundEvent(AUDIO_EVENT_CAMERA_CHARGED)
                    } else if ((prev % 15) >= (curr % 15)) {
                        this.soundEvent(AUDIO_EVENT_CAMERA_CHARGING)
                    }
                }
            }
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
            this.unregisterActiveGhost(entity)
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

    initEngineEvents () {
        const engine = this.engine
        engine.events.on('door.open', ({ x, y }) => {
            this.soundEvent(AUDIO_EVENT_EXPLORE_DOOR_OPEN, {x, y })
        })
        engine.events.on('door.closed', ({ x, y }) => {
            this.soundEvent(AUDIO_EVENT_EXPLORE_DOOR_CLOSE, {x, y })
        })
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

    registerActiveGhost(oGhost) {
        const bInitiallyNoGhost = this.getVengefulGhostCount() === 0
        this._activeGhosts.push(oGhost)
        if (this.getVengefulGhostCount() > 0 && bInitiallyNoGhost) {
            this._audioManager.playOverriddenBGM('music/combat')
        }
    }

    unregisterActiveGhost(oGhost) {
        const bInitiallyHasGhost = this.getVengefulGhostCount() > 0
        const i = this._activeGhosts.indexOf(oGhost);
        if (i >= 0) {
            this._activeGhosts.splice(i, 1);
        }
        if (this.getVengefulGhostCount() === 0 && bInitiallyHasGhost) {
            // la musique de combat
            this._audioManager.stopOverridenBGM()
        }
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
                    const [command, ref, ...args] = tags;
                    if (command === 'photo') {
                        if (aPhotos === null) {
                            aPhotos = [];
                        }
                        aPhotos.push({args, ref, id, x, y});
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
        aPhotos.forEach(({args, ref, id, x, y}) => {
            const remove = () => this.engine.tagManager.grid.removeTag(x, y, id);
            oPhotoScripts[ref].main(this, remove, x, y, ...args);
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
        this.album.storePhoto(oPhoto.toDataURL('image/webp', 0.85), type, value, ref);
        this.ui.displayPhotoScore(value);
        return oPhoto;
    }

    hasRecentlyShot() {
        const nLastTime = this.visor.lastShotTime;
        const nThisTime = this.engine.getTime();
        return ((nThisTime - nLastTime) < CONSTS.CAMERA_RETRIGGER_DELAY)
    }

    /**
     * shoot a photo
     */
    triggerCamera() {
        if (this.isPlayerFrozen()) {
            return
        }
        if (this.hasRecentlyShot()) {
            // trop peu de temps depuis la dernière photo
            return;
        }
        // capture screenshot
        // this.engine.raycaster.screenshot(null, null, 'image/jpeg');
        this.engine.filters.link(new Flash({
            duration: CONSTS.FLASH_DURATION * 2,
            strength: 6
        }));
        this.soundEvent(CONSTS.AUDIO_EVENT_CAMERA_SHOOT)
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
        this.visor.setShootLastTime(this.engine.getTime());
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
            this.logic.incScore(oGhostDetails.value)
            this.log('increment score', oGhostDetails.value)
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
            if (!this.isPlayerFrozen()) {
                this.raiseCamera();
            }
        }
    }

    /**
     * show visor interface and go to visor navigation mode
     */
    raiseCamera() {
        if (this.isCameraRaisable()) {
            this.visor.depleteEnergy();
            const oCamera = this.player;
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
        const oCamera = this.player;
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

    getVengefulGhostCount () {
        return this._activeGhosts.filter(g => g.data.type === 'v').length
    }

    /**
     * Captures an image at the given location (player location by default)
     * @param pos {Position}
     * @returns {HTMLCanvasElement} image (jpeg)
     */
    capture(pos = null) {
        // creation d'une capture
        if (pos === null) {
            pos = this.player.position;
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
        this.player.thinker.frozen = true;
    }

    /**
     * unfreeze player
     */
    thawPlayer() {
        this.player.thinker.frozen = false;
    }

    /**
     * returns true if player commands are frozen (keys + mouse)
     * @return {boolean}
     */
    isPlayerFrozen() {
        return this.player.thinker.frozen;
    }

    get player() {
        return this.engine.camera;
    }

    /**
     * A ghost is attacking player
     * applying wound on player
     * applying visual effect
     */
    commitGhostAttack(oGhost, oTarget, nMultiplier) {
        if (oTarget === this.player) {
            // get ghost power
            this.logic.damagePlayer(oGhost, nMultiplier);
            const oThinker = this.player.thinker;
            oThinker.ghostThreat(oGhost);
            // filtre visuel
            const oFilter = new Timed({
                child: new RedHaze(),
                duration: 750
            });
            this.soundEvent(AUDIO_EVENT_GHOST_ATTACK, { entity: oGhost })
            this.engine.filters.link(oFilter);
            if (this.logic.isPlayerDead()) {
                this.gameOver();
            }
        }
    }

    gameOver () {
        this.player.thinker.kill();
        this.freezePlayer();
        this._audioManager.generalFadeOutAndStop()
        this.engine.delayCommand(() => {
            // fading out
            this.engine.filters.link(new GameOver());
            this.screen.disablePointerLock();
            this.ui.commit('SET_GAME_OVER_PROMPT_VISIBLE', { value: true });
        }, 1500);
    }

    endOfGame () {
        this.freezePlayer();
        this.screen.disablePointerLock();
        this.ui.commit('SET_END_OF_GAME_VISIBLE', { value: true });
        this._audioManager.generalFadeOutAndStop()
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
        this.registerActiveGhost(oGhost);
        oGhost.thinker.target = this.player;
        oGhost.data.events = {
            death: null,
            attack: null,
            damaged: null
        }
        this.soundEvent(AUDIO_EVENT_GHOST_SPAWN, {
            entity: oGhost
        })
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
     * Returns true if the locator has been placed on map
     * @param sRef {string}
     * @return {boolean}
     */
    isLocatorDefined(sRef) {
        return sRef in this._locators
    }

    /**
     * Retrieves a locator by its reference
     * @param sRef {string}
     * @return {*}
     */
    getLocator(sRef) {
        if (this.isLocatorDefined(sRef)) {
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
        const audio = this._audioManager.state
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

//                               _
//     ___  ___  _   _ _ __   __| |___
//    / __|/ _ \| | | | '_ \ / _` / __|
//    \__ \ (_) | |_| | | | | (_| \__ \
//    |___/\___/ \__,_|_| |_|\__,_|___/

    soundEvent(sId, params = {}) {
        const am = this._audioManager
        switch (sId) {
            case AUDIO_EVENT_CAMERA_SHOOT: {
                const { sound, id } = am.play('camera-trigger')
                sound.rate(Math.random() * 0.2 + 0.9, id)
                break
            }

            case AUDIO_EVENT_CAMERA_CHARGING: {
                am.play('camera-charge')
                break
            }

            case AUDIO_EVENT_CAMERA_CHARGED: {
                am.play('camera-full-charge')
                break
            }

            case AUDIO_EVENT_GHOST_BURN: {
                const {sound, id} = am.play('ghost-burn')
                const p = params.entity.position
                sound.pos(p.x, p.y, p.z, id)
                sound.pannerAttr(am.getPannerAttribute(), id)
                break
            }

            case AUDIO_EVENT_GHOST_SPAWN: {
                const oGhost = params.entity
                if (('sounds' in oGhost.data) && ('spawn' in oGhost.data.sounds)) {
                    am.playAmbiance(oGhost.data.sounds.spawn).then(({ sound }) => {
                        console.log('play ghost sound', oGhost.data.sounds.spawn)
                        const p = oGhost.position
                        sound.pos(p.x, p.y, p.z)
                        sound.pannerAttr(am.getPannerAttribute())
                    })
                }
                break
            }

            case AUDIO_EVENT_GHOST_DIE: {
                const entity = params.entity
                const soundset = entity.data.soundset
                if (soundset) {
                    const { sound, id } = am.play(soundset + '-die')
                    const p = entity.position
                    sound.pos(p.x, p.y, p.z, id)
                    sound.rate(Math.random() * 0.4 + 0.8, id)
                    sound.pannerAttr(am.getPannerAttribute(), id)
                } else {
                    console.error('no soundset define for this ghost')
                }
                break
            }

            case AUDIO_EVENT_GHOST_ATTACK: {
                const {sound, id} = am.play('ghost-attack')
                const p = params.entity.position
                sound.pos(p.x, p.y, p.z, id)
                sound.pannerAttr(am.getPannerAttribute(), id)
                break
            }

            case AUDIO_EVENT_GHOST_WOUNDED: {
                const entity = params.entity
                const soundset = entity.data.soundset
                if (soundset) {
                    const { sound, id } = am.play(soundset + '-hit')
                    const p = entity.position
                    sound.pos(p.x, p.y, p.z, id)
                    sound.rate(Math.random() * 0.4 + 0.8, id)
                    sound.pannerAttr(am.getPannerAttribute(), id)
                } else {
                    console.error('no soundset define for this ghost')
                }
                break
            }

            case AUDIO_EVENT_EXPLORE_PICKUP_ITEM: {
                am.play(params.item.type)
                break
            }

            case AUDIO_EVENT_EXPLORE_DOOR_CLOSE: {
                const { x, y } = params
                const aTags = this.getTagsAt(x, y)
                const oDoorTag = aTags.find(t => t.tag[0] === 'doorsound')
                if (oDoorTag) {
                    const { sound, id } = am.play(oDoorTag.tag[2])
                    const p = this.engine.getCellCenter(x, y)
                    sound.pos(p.x, p.y, 1, id)
                    sound.pannerAttr(am.getPannerAttribute(), id)
                }
                break
            }

            case AUDIO_EVENT_EXPLORE_DOOR_OPEN: {
                const { x, y } = params
                const aTags = this.getTagsAt(x, y)
                const oDoorTag = aTags.find(t => t.tag[0] === 'doorsound')
                if (oDoorTag) {
                    const { sound, id } = am.play(oDoorTag.tag[1])
                    const p = this.engine.getCellCenter(x, y)
                    sound.pos(p.x, p.y, 1, id)
                    sound.pannerAttr(am.getPannerAttribute(), id)
                }
                break
            }

            case AUDIO_EVENT_EXPLORE_DOOR_LOCKED: {
                am.play('door-locked')
                break
            }

            case AUDIO_EVENT_EXPLORE_DOOR_UNLOCK: {
                am.play('door-unlock')
                break
            }

            case AUDIO_EVENT_AMBIANCE_LOOP: {
                const sFile = params.file
                console.log('[g] starting ambiance loop', sFile)
                const pos = this.engine.getCellCenter(params.x, params.y)
                am.playAmbiance(sFile, true).then(({ sound }) => {
                    sound.pos(pos.x, pos.y, 1)
                    sound.pannerAttr(am.getPannerAttribute(params.distance))
                })
                break
            }

            case AUDIO_EVENT_AMBIANCE_TRIGGER: {
                const sFile = params.file
                console.log('[g] trigger ambiance sound', sFile)
                am.playAmbiance(sFile, false)
                break
            }
        }
    }
}

export default Game;
