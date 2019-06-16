import * as CONSTS from "./consts";
import * as RC_CONSTS from "../raycaster/consts";

import DoorManager from "./DoorManager";
import DoorContext from "./DoorContext";
import Scheduler from "./Scheduler";
import Horde from "./Horde";
import Easing from "../easing";
import Entity from "./Entity";
import Blueprint from "./Blueprint";
import util from "util";
import CanvasHelper from "../canvas-helper/CanvasHelper";
import Translator from "../translator/Translator";
import Renderer from "../raycaster/Renderer";
import MapHelper from "../raycaster/MapHelper";
import Camera from "./Camera";
import thinkers from "./thinkers";
import {suggest} from "../levenshtein";
import {fetchJSON} from '../fetch-json';

import Events from "events";
import Collider from "../collider/Collider";
import TagManager from "./TagManager";


class Engine {
    constructor() {
        // to be instanciate for each level
        this._rc = null;
        this._dm = null;
        this._scheduler = null;
        this._horde = null;
        this._camera = null;
        this._tilesets = null;
        this._blueprints = null;
        this._time = 0;
        this._interval = null;

        // instanciate at construct
        this._thinkers = {};
        this.useThinkers(thinkers);
        this._collider = new Collider(); // this collider is freely used by certain thinkers
        this._collider.setCellWidth(CONSTS.METRIC_COLLIDER_SECTOR_SIZE);
        this._collider.setCellHeight(CONSTS.METRIC_COLLIDER_SECTOR_SIZE);

        this._TIME_INTERVAL = 40;
        this._timeMod = 0;
        this._renderContext = null;

        this._events = new Events();
    }

    get events() {
        return this._events;
    }

    /**
     * This will setup the renderer and all associated structures
     */
    initializeRenderer() {
        this._rc = new Renderer();
        this._dm = new DoorManager();
        this._tm = new TagManager();
        this._scheduler = new Scheduler();
        this._horde = new Horde();
        this.initializeCamera();
        this._blueprints = {};
        this._tilesets = {};
        this._timeMod = 0;
        this._time = 0;
        this._rc._optionsReactor.events.on('changed', ({key}) => {
            this.updateRaycasterOption(key);
        });
        this._tm.events.on('tagenter', event => this._tagEnter(event));
        this._tm.events.on('tagleave', event => this._tagLeave(event));
        this._tm.events.on('tagpush', event => this._tagPush(event));
        this._events.emit('initialized');
    }

    initializeCamera() {
        const camera = new Camera();
        camera.visible = false;
        camera.size = CONSTS.METRIC_CAMERA_DEFAULT_SIZE;
        this._camera = camera;
    }

    /**
     * One of the raycaster options has changed value, we should check it here
     */
    updateRaycasterOption(key) {
        switch (key) {
            case 'metrics.spacing':
                break;
        }
    }

    get horde() {
        return this._horde;
    }

    get camera() {
        return this._camera;
    }

    set camera(value) {
        this._camera = value;
    }

    getTime() {
        return this._time;
    }



//      _                                                                                _
//   __| | ___   ___  _ __   _ __ ___   __ _ _ __   __ _  __ _  ___ _ __ ___   ___ _ __ | |_
//  / _` |/ _ \ / _ \| '__| | '_ ` _ \ / _` | '_ \ / _` |/ _` |/ _ \ '_ ` _ \ / _ \ '_ \| __|
// | (_| | (_) | (_) | |    | | | | | | (_| | | | | (_| | (_| |  __/ | | | | |  __/ | | | |_
//  \__,_|\___/ \___/|_|    |_| |_| |_|\__,_|_| |_|\__,_|\__, |\___|_| |_| |_|\___|_| |_|\__|
//                                                       |___/


    /**
     * this function iterates throught all adjacent cells and run a given function for each cell
     * @param x {number} cell position x
     * @param y {number} cell position y
     * @param pFunction {function} a function(x, y, n) called each time a cell is iterated
     * @param nType {number} if CELL_NEIGHBOR_SIDE then only side-adjacent cells are iterated -> 4 cells
     * if CELL_NEIGHBOR_CORNER then corner-adjacent cells are iterated -> 4 cells
     * can be a combinason : CELL_NEIGHBOR_SIDE | CELL_NEIGHBOR_CORNER
     */
    _forEachNeighbor(x, y, pFunction, nType) {
        if (!pFunction) {
            return;
        }
        const bSides = (nType & CONSTS.CELL_NEIGHBOR_SIDE) > 0; // if true, then side-sharing cells are selected
        const bCorners = (nType & CONSTS.CELL_NEIGHBOR_CORNER) > 0; // if true, then corner-sharing cells are selected
        const bSelf = (nType & CONSTS.CELL_NEIGHBOR_SELF) > 0; // if true then the cell itself is selected
        for (let xi = -1; xi < 2; ++xi) {
            for (let yi = -1; yi < 2; ++yi) {
                const bxi0 = xi === 0 ? 2 : 0;
                const byi0 = yi === 0 ? 1 : 0;
                const n0 = bxi0 | byi0;
                const xix = xi + x;
                const yiy = yi + y;
                let bTest = false;
                switch (n0) {
                    case 3: // the cell itself
                        bTest = bSelf;
                        break;

                    case 0: // a corner
                        bTest = bCorners;
                        break;

                    case 1:
                    case 2: // a side
                        bTest = bSides;
                        break;
                }
                if (bTest) {
                    pFunction(xix, yiy, this._rc.getCellPhys(xix, yiy));
                }
            }
        }
    }

    /**
     * Same as buildDoorContext, bu with secret blocks
     * @param x {number} cell position x
     * @param y [number} cell position y
     * @private
     */
    _buildSecretDoorContext(x, y) {
        const rc = this._rc;
        const dm = this._dm;
        const metrics = rc.options.metrics;
        const nOffsetMax = metrics.spacing;
        const nSlidingDuration = CONSTS.DOOR_SLIDING_DURATION * 3;
        const nPhysCode = rc.getCellPhys(x, y);
        const sFunction1 = Easing.SQUARE_ACCEL;
        const sFunction2 = Easing.SQUARE_DECCEL;
        const nMaintainDuration = Infinity;
        // primary secret door
        const dc1 = new DoorContext({
            sdur: nSlidingDuration,
            mdur: nMaintainDuration,
            ofsmax: nOffsetMax,
            sfunc: sFunction1
        });
        dc1.data.x = x;
        dc1.data.y = y;
        dc1.data.phys = nPhysCode;
        dc1.event.on('check', event => this._checkDoorClosability(event));
        let nSecurityCheck = 0;
        this._forEachNeighbor(x, y, (xc, yc, phys) => {
            if (phys === RC_CONSTS.PHYS_SECRET_BLOCK) {
                // secondary secret door
                if (++nSecurityCheck > 1) {
                    throw new Error(util.format('this secret block has more than one secret neighbor : (%d, %d)', x, y));
                }
                const dc2 = new DoorContext({
                    sdur: nSlidingDuration,
                    mdur: nMaintainDuration,
                    ofsmax: nOffsetMax,
                    sfunc: sFunction2,
                    ddur: nSlidingDuration
                });
                dc2.data.x = xc;
                dc2.data.y = yc;
                dc2.data.phys = phys;
                dc2.event.on('check', event => this._checkDoorClosability(event));
                dc1.data.child = dc2;
                dm.linkDoorContext(dc2);
            }
        }, CONSTS.CELL_NEIGHBOR_SIDE);
        dm.linkDoorContext(dc1);
    }

    /**
     * If the cell contains an entity it will cancel the given "door close event"
     * @param context {DoorContext}
     * @param cancel {boolean} will be turn to true if an entity blocks the way
     * @private
     */
    _checkDoorClosability({context, cancel}) {
        const data = context.data;
        const {x, y} = data;
        // TODO check with entity manager
    }

    /**
     * creates a door context for the specified cell.
     * of course the cell must describe a door, and have a phys code of type PHYS_DOOR_* or PHYS_CURT_* or PHYS_SECRET_BLOCK
     * @param x {number} cell position x
     * @param y [number} cell position y
     * @param bAutoclose {boolean} if true, then the door will auto close after a certain time (see DOOR_MAINTAIN_DURATION constant)
     * @private
     */
    _buildDoorContext(x, y, bAutoclose) {
        const rc = this._rc;
        const metrics = rc.options.metrics;
        const nPhysCode = rc.getCellPhys(x, y);
        let nOffsetMax, fSlidingDuration;

        switch (nPhysCode) {
            case RC_CONSTS.PHYS_DOOR_DOUBLE:
                nOffsetMax = metrics.spacing >> 1;
                fSlidingDuration = 0.5;
                break;

            case RC_CONSTS.PHYS_DOOR_RIGHT:
            case RC_CONSTS.PHYS_DOOR_LEFT:
                nOffsetMax = metrics.height;
                fSlidingDuration = 1;
                break;

            case RC_CONSTS.PHYS_DOOR_UP:
            case RC_CONSTS.PHYS_DOOR_DOWN:
                nOffsetMax = metrics.height;
                fSlidingDuration = 1.5;
                break;

            case RC_CONSTS.PHYS_CURT_UP:
            case RC_CONSTS.PHYS_CURT_DOWN:
                nOffsetMax = metrics.height;
                fSlidingDuration = 1.8;
                break;

            case RC_CONSTS.PHYS_SECRET_BLOCK:
                this._buildSecretDoorContext(x, y);
                return;

            default:
                return;
        }
        const dc = new DoorContext({
            sdur: CONSTS.DOOR_SLIDING_DURATION * fSlidingDuration | 0,
            mdur: bAutoclose ? CONSTS.DOOR_MAINTAIN_DURATION : Infinity,
            ofsmax: nOffsetMax,
            sfunc: Easing.SMOOTHSTEP
        });
        dc.data.x = x;
        dc.data.y = y;
        dc.data.phys = nPhysCode;
        //dc.events.on('check', event => this._checkDoorClosability(event));
        const dm = this._dm;
        dm.linkDoorContext(dc);
    }

    /**
     * Processes all doors, updates all offsets.
     * @private
     */
    _doorProcess() {
        const rc = this._rc;
        this._dm.process().forEach(dmp => {
            const {x, y, offset, phys} = dmp;
            rc.setCellOffset(x, y, offset);
            rc.setCellPhys(x, y, phys);
        });
    }



    /**
     * Computes all things
     * @param nTime {number} number of milliseconds you want to advance simulation
     */
    _update(nTime) {
        const tp = this._TIME_INTERVAL;
        this._time += nTime;
        const tm = this._timeMod + nTime;
        const nTimes = Math.min(10, tm / tp | 0);
        this._timeMod = tm % tp;
        let bRender = false;
        for (let i = 0; i < nTimes; ++i) {
            // logic doom loop here
            this._scheduler.schedule(this._time);
            this._doorProcess();
            // entity management
            this._camera.think(this);
            this._horde.process(this);
            this
                ._horde
                .getDeadEntities()
                .forEach(e => this.destroyEntity(e));
            // special effect management
            this._tm.hordeProcess(this);
            bRender = true;
            this._events.emit('update');
        }
        if (bRender) {
            this._render();
        }
    }

    _render() {
        const rend = this._rc;
        // recompute all texture/sprite animation with a time-delta of 40ms
        rend.computeAnimations(this._TIME_INTERVAL);
        // create a new scene for these parameters
        const camera = this._camera;
        if (camera) {
            const loc = camera.location;
            // render the scene, the scene will be rendered on the internal canvas of the raycaster renderer
            rend.render(loc.x, loc.y, loc.angle, loc.z);
            // display the raycaster internal canvas on the physical DOM canvas
            // requestAnimationFrame is called here to v-synchronize and have a neat animation
            requestAnimationFrame(() => {
                rend.flip(this._renderContext);
                this._events.emit('render');
            });
        }
    }

    /**
     * defines a rendering canvas
     * @param oCanvas {HTMLCanvasElement} the output canvas
     */
    setRenderingCanvas(oCanvas) {
        this._renderCanvas = oCanvas;
        this._renderContext = oCanvas.getContext('2d');
    }

    /**
     * get the rendering canvas, after being set by setRenderingCanvas
     * @returns {HTMLCanvasElement}
     */
    getRenderingCanvas() {
        return this._renderCanvas;
    }

    get raycaster() {
        return this._rc;
    }

    /**
     * get the rendering 2d Context
     * @returns {CanvasRenderingContext2D}
     */
    getRenderingContext() {
        return this._renderContext;
    }


    /**
     * starts the doom loop
     */
    startDoomLoop() {
        this.stopDoomLoop();
        this._interval = setInterval(() => this._update(this._TIME_INTERVAL), this._TIME_INTERVAL);
    }

    /**
     * stops the doom loop, freezing the game animation
     */
    stopDoomLoop() {
        if (this._interval) {
            clearInterval(this._interval);
        }
    }


    // PUBLIC API
//              _     _ _           _      ____  ___
//  _ __  _   _| |__ | (_) ___     / \    |  _ \|_ _|
// | '_ \| | | | '_ \| | |/ __|   / _ \   | |_) || |
// | |_) | |_| | |_) | | | (__   / ___ \ _|  __/ | | _
// | .__/ \__,_|_.__/|_|_|\___| /_/   \_(_)_| (_)___(_)
// |_|


    /**
     * resolves a block action, an action where an entity uses its "push" action on a wall
     * @param entity {Entity}
     * @param x {number}
     * @param y {number}
     */
    pushBlock(entity, x, y) {
        this._tm.entityPushBlock(this, entity, x, y);
    }

    /**
     * Opens a door at a specified position. The cell at x, y must have a PHYS_DOOR_*, PHYS_CURT_* or PHYS_SECRET_BLOCK physical code
     * @param x {number} position of cell x
     * @param y {number} position of cell y
     * @param bAutoclose {boolean} if true, then the door will auto close after a certain time (see DOOR_MAINTAIN_DURATION constant)
     */
    openDoor(x, y, bAutoclose) {
        this._buildDoorContext(x, y, bAutoclose);
    }

    /**
     * Closes a door that has already been open. This is the only way to close a door that can't automatically close.
     * Note that the door won't immediatly close if an entity is in the way. But rather it will autoclose after the entity
     * is gone, even if it was originally a non-autoclose door.
     * @param x {number} position of door x
     * @param y {number} position of door y
     */
    closeDoor(x, y) {
        const dc = this._dm.getDoorContext(x, y);
        if (dc) {
            if (dc.data.child) {
                dc.event.once('close', () => dc.close());
                dc.data.child.close();
            } else {
                dc.close();
            }
        }
    }

	/**
	 * Delays a command, just like a setTimeout, but the command will be synced with the doomloop
	 * So it will be fired just before rendering process
	 * @param nTime {number} delay in millisecond
	 * @param pCommand {function} function whose execution is delayed
	 * @return {number} delay identifier usable with the "cancelCommand" function
	 */
    delayCommand(pCommand, nTime) {
        if (typeof pCommand !== 'function') {
            throw new Error('delayCommand: first parameter need to be a valid function');
        }
        return this._scheduler.delayCommand(pCommand, nTime);
    }

	/**
	 * Cancels a previously delayed command.
	 * @param id {number} identifier produced by the delayCommand function
	 */
    cancelCommand(id) {
        this._scheduler.cancelCommand(id);
    }

//  _                                                                            _
// | |_ __ _  __ _   _ __ ___   __ _ _ __   __ _  __ _  ___ _ __ ___   ___ _ __ | |_
// | __/ _` |/ _` | | '_ ` _ \ / _` | '_ \ / _` |/ _` |/ _ \ '_ ` _ \ / _ \ '_ \| __|
// | || (_| | (_| | | | | | | | (_| | | | | (_| | (_| |  __/ | | | | |  __/ | | | |_
//  \__\__,_|\__, | |_| |_| |_|\__,_|_| |_|\__,_|\__, |\___|_| |_| |_|\___|_| |_|\__|
//           |___/                               |___/


    _tagEnter({entity, command, parameters, remove}) {
        this._events.emit('tag.' + command + '.enter', {entity, parameters, remove});
    }

    _tagLeave({entity, command, parameters, remove}) {
        this._events.emit('tag.' + command + '.leave', {entity, parameters, remove});
    }

    _tagPush({entity, command, parameters, remove}) {
        this._events.emit('tag.' + command + '.push', {entity, parameters, remove});
    }

    addTag(x, y, sTag) {
        this._tm.addTag(x, y, sTag);
    }

//  _____ _     _       _                                                                           _
// |_   _| |__ (_)_ __ | | _____ _ __   _ __ ___   __ _ _ __   __ _  __ _  ___ _ __ ___   ___ _ __ | |_
//   | | | '_ \| | '_ \| |/ / _ \ '__| | '_ ` _ \ / _` | '_ \ / _` |/ _` |/ _ \ '_ ` _ \ / _ \ '_ \| __|
//   | | | | | | | | | |   <  __/ |    | | | | | | (_| | | | | (_| | (_| |  __/ | | | | |  __/ | | | |_
//   |_| |_| |_|_|_| |_|_|\_\___|_|    |_| |_| |_|\__,_|_| |_|\__,_|\__, |\___|_| |_| |_|\___|_| |_|\__|
//                                                                  |___/


    /**
     * declares a new thinker class
     * @param sThinker {string} reference of thinker
     * @param pThinker {prototype}
     */
    useThinker(sThinker, pThinker) {
        this._thinkers[sThinker] = pThinker;
    }

    useThinkers(oThinkers) {
        for (let sThinker in oThinkers) {
            this.useThinker(sThinker, oThinkers[sThinker]);
        }
    }

    /**
     * this function will extract an item out of a collection
     * @param sItem {string} item key
     * @param oItems {object} collection of items
     * @param sLabel {string} a label in case of error
     * @returns {*}
     * @private
     */
    _getObjectItem(sItem, oItems, sLabel) {
        if (typeof oItems !== 'object') {
            throw new Error(util.format('this is not a collection of "%s"', sLabel));
        }
        if (sItem in oItems) {
            return oItems[sItem];
        } else {
            const aItems = Object.keys(oItems);
            if (aItems.length > 0) {
                throw new Error(util.format('There is no such %s : "%s". Did you mean "%s" ?', sLabel, sItem, suggest(sItem, aItems)));
            } else {
                throw new Error(util.format('No %s has been declared so far in the given collection', sLabel));
            }
        }
    }

    createThinkerInstance(sThinker) {
        if (!sThinker) {
            sThinker = 'Thinker';
        }
        const pThinker = this._getObjectItem(sThinker, this._thinkers, 'thinker');
        if (!pThinker) {
            throw new Error('this thinker does not exists (has not been "used") : ' + sThinker);
        }
        const oThinker = new pThinker();
        oThinker.engine = this;
        return oThinker;
    }


    /**
     * Loads a tileset
     * @param ref {string} reference name
     * @param src {string} url to image
     * @param tileWidth {number} width
     * @param tileHeight {number} height
     * @returns {Promise<*>}
     */
    async loadTileSet(ref, src, tileWidth, tileHeight) {
        if (ref in this._tilesets) {
            return this._tilesets[ref];
        }
        const oImage = await CanvasHelper.loadCanvas(src);
        const tileset = this._rc.buildTileSet(oImage, tileWidth, tileHeight);
        this._tilesets[ref] = tileset;
        return tileset;
    }

    /**
     * Creates a blueprint, using an image which is loaded asynchronously, thus the promise.
     * @param resref {string} new blueprint reference
     * @param bpDef {*}  the blueprint structure
     * @param data {*} all the blueprints structure
     * @returns {Promise<Blueprint>}
     */
    async createBlueprint(resref, bpDef, data) {
        const tsDef = data.tilesets.find(tsi => tsi.id === bpDef.tileset);
        if (!tsDef) {
            throw new Error('blueprint "' + resref + '" references a tileset : "' + bpDef.tileset + '" which does not exist');
        }
        const src = tsDef.src;
        const tileWidth = tsDef.width;
        const tileHeight = tsDef.height;
        const tileset = await this.loadTileSet(bpDef.tileset, src, tileWidth, tileHeight);
        const bp = new Blueprint();
        bp.tileset = tileset;
        if ('thinker' in bpDef) {
            bp.thinker = bpDef.thinker; // state object : should not be instanciate yet
        }
        if ('animations' in tsDef) {
            const bpa = {};
            tsDef.animations.forEach(a => {
                bpa[a.id] = {
                    start: a.start,
                    length: a.length,
                    loop: a.loop
                };
            });
            bp.animations = bpa;
        }
        bp.size = bpDef.size;
        bp.fx = bpDef.fx || [];
        return this._blueprints[resref] = bp;
    }


//             _   _ _                                                                       _
//   ___ _ __ | |_(_) |_ _   _   _ __ ___   __ _ _ __   __ _  __ _  ___ _ __ ___   ___ _ __ | |_
//  / _ \ '_ \| __| | __| | | | | '_ ` _ \ / _` | '_ \ / _` |/ _` |/ _ \ '_ ` _ \ / _ \ '_ \| __|
// |  __/ | | | |_| | |_| |_| | | | | | | | (_| | | | | (_| | (_| |  __/ | | | | |  __/ | | | |_
//  \___|_| |_|\__|_|\__|\__, | |_| |_| |_|\__,_|_| |_|\__,_|\__, |\___|_| |_| |_|\___|_| |_|\__|
//                       |___/                               |___/

    /**
     * Will create a new Entity, but will not link it into the engine entity collection
     * You must do this with linkEntity()
     * @param resref {string} resource reference of the blueprint, to create the entity
     * @returns {Entity}
     */
    createEntity(resref, location) {
        const rc = this._rc;
        const bp = this._blueprints[resref];
        const entity = new Entity();
        entity.location.set(location);
        const sprite = rc.buildSprite(bp.tileset);
        bp.fx.forEach(fx => sprite.addFlag(fx));
        const animations = bp.animations;
        if (animations) {
            // instantiates animations
            for (let iAnim in animations) {
                sprite.buildAnimation(animations[iAnim], iAnim);
            }
        }
        entity.thinker = this.createThinkerInstance(bp.thinker);
        entity.sprite = sprite;
        entity.size = bp.size;
        this._horde.linkEntity(entity);
        this.events.emit('entitycreated', {entity});
        return entity;
    }

    destroyEntity(e) {
        if (this._horde.isEntityLinked(e)) {
            this._rc.disposeSprite(e.sprite);
            this._horde.unlinkEntity(e);
            this.events.emit('entitydestroyed', {entity: e});
        }
    }


//  _ _       _     _
// | (_) __ _| |__ | |_ ___  ___  _   _ _ __ ___ ___  ___
// | | |/ _` | '_ \| __/ __|/ _ \| | | | '__/ __/ _ \/ __|
// | | | (_| | | | | |_\__ \ (_) | |_| | | | (_|  __/\__ \
// |_|_|\__, |_| |_|\__|___/\___/ \__,_|_|  \___\___||___/
//      |___/


    /**
     * creates a new light source at the given position, with the given radius and intensity
     * @param x {number} coordinates of the light source center (x axis)
     * @param y {number} coordinates of the light source center (y axis)
     * @param r0 {number} inner radius (where light is at full intensity)
     * @param r1 {number} outer radius (where light is totaly dimmed)
     * @param v {number} light intensity
     * @returns {{x: *, y: *, r0: *, r1: *, intensity: *}}
     * the resulting object properties can be manipulated, this will be reflected in the next rendering
     */
    createLightSource(x, y, r0, r1, v) {
        return this._rc.addLightSource(x, y, r0, r1, v);
    }

    /**
     * removes a light source previously created by createLightSource
     * @param oSource {*}
     */
    removeLightSource(oSource) {
        oSource.remove();
    }



//    _
//   (_)___  ___  _ __    _ __   __ _ _ __ ___  ___
//   | / __|/ _ \| '_ \  | '_ \ / _` | '__/ __|/ _ \
//   | \__ \ (_) | | | | | |_) | (_| | |  \__ \  __/
//  _/ |___/\___/|_| |_| | .__/ \__,_|_|  |___/\___|
// |__/                  |_|


    /**
     * Builds a level with the specified content
     * @param data {*} level definition
     * @param monitor {function} callback to a function called when the building process is progressing
     * @param extra {null|{blueprints: [], tilesets: []}} common blueprints and tilesets definition
     * @return {Promise<void>}
     */
    async buildLevel(data, monitor, extra = null) {
        if (typeof extra === 'object' && extra !== null) {
            if ('blueprints' in extra) {
                extra.blueprints.forEach(bp => data.blueprints.push(bp));
            }
            if ('tilesets' in extra) {
                extra.tilesets.forEach(ts => data.tilesets.push(ts));
            }
        }
        const BLUEPRINT_COUNT = data.blueprints.length; // Object.keys(data.blueprints).length;
        const DECAL_COUNT = data.decals ? Object.keys(data.decals).length : 0;
        const TAG_COUNT = data.tags ? 1 : 0;
        const TEXTURE_COUNT = 3;
        const ALL_COUNT = TEXTURE_COUNT + BLUEPRINT_COUNT + DECAL_COUNT + TAG_COUNT;

        const feedback = !!monitor ? monitor : (phase, progress) => {};
        feedback('init', 0);
        const oTranslator = new Translator();
        oTranslator.strict = false;
        oTranslator

            // LOOP constants
            .addRule('@LOOP_NONE', RC_CONSTS.ANIM_LOOP_NONE)
            .addRule('@LOOP_FORWARD', RC_CONSTS.ANIM_LOOP_FORWARD)
            .addRule('@LOOP_YOYO', RC_CONSTS.ANIM_LOOP_YOYO)

            // FX constants
            .addRule('@FX_NONE', RC_CONSTS.FX_NONE)
            .addRule('@FX_LIGHT_SOURCE', RC_CONSTS.FX_LIGHT_SOURCE)
            .addRule('@FX_LIGHT_ADD', RC_CONSTS.FX_LIGHT_ADD)
            .addRule('@FX_ALPHA_75', RC_CONSTS.FX_ALPHA_75)
            .addRule('@FX_ALPHA_50', RC_CONSTS.FX_ALPHA_50)
            .addRule('@FX_ALPHA_25', RC_CONSTS.FX_ALPHA_25)

            // PHYS constants
            .addRule('@PHYS_NONE', RC_CONSTS.PHYS_NONE)
            .addRule('@PHYS_WALL', RC_CONSTS.PHYS_WALL)
            .addRule('@PHYS_DOOR_UP', RC_CONSTS.PHYS_DOOR_UP)
            .addRule('@PHYS_CURT_UP', RC_CONSTS.PHYS_CURT_UP)
            .addRule('@PHYS_DOOR_DOWN', RC_CONSTS.PHYS_DOOR_DOWN)
            .addRule('@PHYS_CURT_DOWN', RC_CONSTS.PHYS_CURT_DOWN)
            .addRule('@PHYS_DOOR_LEFT', RC_CONSTS.PHYS_DOOR_LEFT)
            .addRule('@PHYS_DOOR_RIGHT', RC_CONSTS.PHYS_DOOR_RIGHT)
            .addRule('@PHYS_DOOR_DOUBLE', RC_CONSTS.PHYS_DOOR_DOUBLE)
            .addRule('@PHYS_SECRET_BLOCK', RC_CONSTS.PHYS_SECRET_BLOCK)
            .addRule('@PHYS_TRANSPARENT_BLOCK', RC_CONSTS.PHYS_TRANSPARENT_BLOCK)
            .addRule('@PHYS_INVISIBLE_BLOCK', RC_CONSTS.PHYS_INVISIBLE_BLOCK)
            .addRule('@PHYS_OFFSET_BLOCK', RC_CONSTS.PHYS_OFFSET_BLOCK)

            .addRule('@DECAL_ALIGN_TOP_LEFT',     CONSTS.DECAL_ALIGN_TOP_LEFT)
            .addRule('@DECAL_ALIGN_TOP_RIGHT',    CONSTS.DECAL_ALIGN_TOP_RIGHT)
            .addRule('@DECAL_ALIGN_TOP',          CONSTS.DECAL_ALIGN_TOP)
            .addRule('@DECAL_ALIGN_LEFT',         CONSTS.DECAL_ALIGN_LEFT)
            .addRule('@DECAL_ALIGN_RIGHT',        CONSTS.DECAL_ALIGN_RIGHT)
            .addRule('@DECAL_ALIGN_CENTER',       CONSTS.DECAL_ALIGN_CENTER)
            .addRule('@DECAL_ALIGN_BOTTOM_LEFT',  CONSTS.DECAL_ALIGN_BOTTOM_LEFT)
            .addRule('@DECAL_ALIGN_BOTTOM_RIGHT', CONSTS.DECAL_ALIGN_BOTTOM_RIGHT)
            .addRule('@DECAL_ALIGN_BOTTOM',       CONSTS.DECAL_ALIGN_BOTTOM)
        ;
        data = oTranslator.translateStructure(data);

        this.initializeRenderer();
        const rc = this._rc;
        const cvs = this.getRenderingCanvas();

        const oRCOptions = {
            metrics: data.level.metrics,
            screen: {
                width: cvs.width,
                height: cvs.height
            },
            textures: {
                stretch: !!data.level.textures.stretch,
                smooth: !!data.level.textures.smooth
            }
        };

        if ('shading' in data) {
            oRCOptions.shading = data.shading;
        }

        rc.defineOptions(oRCOptions);

        let PROGRESS = 0;
        const showProgress = sLabel => {
            feedback(sLabel, ++PROGRESS / ALL_COUNT);
        };

        // defines sky, walls and flats
        showProgress('loading textures');
        if ('sky' in data.level.textures && !!data.level.textures.sky && data.level.textures.sky !== "") {
            rc.setBackground(await CanvasHelper.loadCanvas(data.level.textures.sky));
        }
        showProgress('loading textures');
        rc.setWallTextures(await CanvasHelper.loadCanvas(data.level.textures.walls));
        showProgress('loading textures');
        rc.setFlatTextures(await CanvasHelper.loadCanvas(data.level.textures.flats));


        // creates blueprints
        let nBp = TEXTURE_COUNT;
        for (let i = 0, l = data.blueprints.length; i < l; ++i) {
            showProgress('creating blueprints');
            const resref = data.blueprints[i].id;
            await this.createBlueprint(resref, data.blueprints[i], data);
            ++nBp;
        }

        if (data.level.legend) {
            const mh = new MapHelper();
            mh.build(rc, data.level);
        }

        const nMapSize = this._rc.getMapSize();
        this._tm.setMapSize(nMapSize);
        // sync with tag grid
        const ps = this._rc.options.metrics.spacing;
        this._collider.grid.setWidth(nMapSize * ps / this._collider.getCellWidth());
        this._collider.grid.setHeight(nMapSize * ps / this._collider.getCellHeight());

        // static objects
        if ('objects' in data) {
            data.objects.forEach(o => {
                const entity = this.createEntity(o.blueprint, o);
                if ('animation' in o && o.animation !== false && o.animation !== null) {
                    entity.sprite.setCurrentAnimation(o.animation, 0);
                }
                entity.visible = true;
            })
        }

        if ('camera' in data) {
            // sets initial camera location, and orientation
            const {x, y, z, angle} = data.camera;
            this.camera.location.set({
                x: x * ps + (ps >> 1), // camera coordinates (x-axis)
                y: y * ps + (ps >> 1), // camera coordinates (y-axis)
                angle, // looking angle
                z: 1 // camera altitude (1 is the default object)
            });
            this.camera.thinker = this.createThinkerInstance(data.camera.thinker);
        }


        const FACES = 'wsenfc';



        /**
         * auto loads a tileset
         * @param ref {string} reference name
         * @param data {object} this is a level definition
         * @returns {Promise<void>}
         */
        const autoLoadTileSet = (ref, data) => {
            try {
                const tsDef = data.tilesets.find(tsi => tsi.id === ref);
                if (!tsDef) {
                    throw new Error('could not auto load tileset : "' + ref + '"');
                }
                const {width, height, src} = tsDef;
                return this.loadTileSet(ref, src, width, height);
            } catch(e) {
                Promise.reject(e.message);
            }
        };


        const installDecal = async (decal, face) => {
            const xCell = decal.x;
            const yCell = decal.y;
            if (face in decal) {
                const iFace = FACES.indexOf(face);
                const {align, tileset} = decal[face];
                const ts = await autoLoadTileSet(tileset, data);
                this._rc.paintSurface(xCell, yCell, iFace, (xCell, yCell, iFace, oCanvas) => {
                    const wCvs = oCanvas.width;
                    const hCvs = oCanvas.height;
                    const wTile = ts.tileWidth;
                    const hTile = ts.tileHeight;
                    const xLeft = 0;
                    const xRight = wCvs - wTile;
                    const xMid = xRight >> 1;
                    const yTop = 0;
                    const yBottom = hCvs - hTile;
                    const yMid = yBottom >> 1;
                    let xd, yd;
                    switch (align) {
                        case 7:
                            xd = xLeft;
                            yd = yTop;
                            break;

                        case 8:
                            xd = xMid;
                            yd = yTop;
                            break;

                        case 9:
                            xd = xRight;
                            yd = yTop;
                            break;

                        case 4:
                            xd = xLeft;
                            yd = yMid;
                            break;

                        case 5:
                            xd = xMid;
                            yd = yMid;
                            break;

                        case 6:
                            xd = xRight;
                            yd = yMid;
                            break;

                        case 1:
                            xd = xLeft;
                            yd = yBottom;
                            break;

                        case 2:
                            xd = xMid;
                            yd = yBottom;
                            break;

                        case 3:
                            xd = xRight;
                            yd = yBottom;
                            break;
                    }
                    oCanvas.getContext('2d').drawImage(ts._originalImage, xd, yd);
                })
            }
        };

        if ('decals' in data) {
            for (let iDecal = 0, nDecalLength = data.decals.length; iDecal < nDecalLength; ++iDecal) {
                const decal = data.decals[iDecal];
                await installDecal(decal, 'n');
                await installDecal(decal, 'e');
                await installDecal(decal, 'w');
                await installDecal(decal, 's');
                await installDecal(decal, 'f');
                await installDecal(decal, 'c');
                showProgress('applying decals');
            }
        }

        showProgress('analyzing tags');
        if ('tags' in data) {
            for (let iTag = 0, nTagLength = data.tags.length; iTag < nTagLength; ++iTag) {
                const tagEntry = data.tags[iTag];
                tagEntry.tags.forEach(t => this.addTag(tagEntry.x, tagEntry.y, t));
            }
        }

        feedback('done', 1);
        this.events.emit('levelbuilt');
    }



//    _                    __      _       _
//   (_)___  ___  _ __    / _| ___| |_ ___| |__
//   | / __|/ _ \| '_ \  | |_ / _ \ __/ __| '_ \
//   | \__ \ (_) | | | | |  _|  __/ || (__| | | |
//  _/ |___/\___/|_| |_| |_|  \___|\__\___|_| |_|
// |__/

    /**
     * This will fetch an asset. You just have to specify the name, without path and without the .json extension.
     * onlye asset type level and data (json) may be loaded this way.
     * @example fetchAsset(CONST.ASSET_TYPE_LEVEL, 'the-hangar') will fetch a level file named "./assets/level/the-hangar.json"
     * (because the asset type is ASST_TYPE_LEVEL
     * @param sType {string} on of the constant ASSET_TYPE_*
     * @param sName {string} asset name
     * @return {*} the loaded json (a promise in fact)
     */
    fetchAsset(sType, sName) {
        switch (sType) {
            case CONSTS.ASSET_TYPE_DATA:
            case CONSTS.ASSET_TYPE_LEVEL:
                return fetchJSON(CONSTS.PATH_ASSETS + '/' + sType + '/' + sName + '.json');

            default:
                return Promise.reject('asset "' + sName + '" not found in directory "' + CONSTS.PATH_ASSETS + '/' + sType + '"');
        }
    }
}

export default Engine;
