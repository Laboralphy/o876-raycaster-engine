import * as CONSTS from "./consts";
import * as RC_CONSTS from "../raycaster/consts";

import DoorManager from "./DoorManager";
import DoorContext from "./DoorContext";
import Scheduler from "./Scheduler";
import Horde from "./Horde";
import Easing from "../easing";
import Entity from "./Entity";
import Blueprint from "./Blueprint";
import CanvasHelper from "../canvas-helper/CanvasHelper";
import Translator from "../translator/Translator";
import Extender from "../object-helper/Extender";
import Renderer from "../raycaster/Renderer";
import MapHelper from "../raycaster/MapHelper";
import Camera from "./Camera";
import thinkers from "./thinkers";
import {suggest} from "../levenshtein";
import {jsonValidate} from '../json-validate';
import SCHEMA_RCE_100 from '../schemas/rce-100.json';

import Events from "events";
import TagManager from "./TagManager";
import FilterManager from "../filters/FilterManager";
import MarkerRegistry from "../marker-registry";
import Position from "./Position";
import Smasher from "libs/smasher/Smasher";


class Engine {
    constructor() {
        // state
        this._dm = null;
        this._locks = null;
        this._time = 0;

        // defined by level loading
        this._rc = null;
        this._horde = null;
        this._camera = null;
        this._tilesets = null;
        this._blueprints = null;
        this._materials = null;
        this._interval = null;
        this._refs = null;
        this._scheduler = null;

        // instanciate at construct
        this._thinkers = {};
        this._thinkerContext = {};
        this.useThinkers(thinkers);

        this._smasher = new Smasher();
        this._smasher.setCellWidth(CONSTS.METRIC_SMASHER_SECTOR_SIZE);
        this._smasher.setCellHeight(CONSTS.METRIC_SMASHER_SECTOR_SIZE);

        this._smasher.events.on('entity.dummy.update', ({entity}) => {
            this._syncEntityDummy(entity);
        });
        this._smasher.events.on('entity.smashed', ({entity, smashers}) => {
            this._smashEntity(entity, smashers);
        });

        // init
        this._TIME_INTERVAL = 40;
        this._timeMod = 0;
        this._renderContext = null;
        this._filters = new FilterManager();
        this._events = new Events();
        // this._startpoints = [];

        this._config = {
            thinkers: {},
            cameraThinker: 'FPSControlThinker'
        };
    }

    get config() {
        return this._config
    }

    set config(value) {
        this._config = value;
    }

    /**
     * returns the filter manager instance
     * @returns {FilterManager}
     */
    get filters() {
        return this._filters;
    }

    /**
     * Returns the EventEmiiter instance
     * @returns {EventEmitter}
     */
    get events() {
        return this._events;
    }

    get smasher() {
        return this._smasher;
    }

    get timeInterval () {
        return this._TIME_INTERVAL
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
        this._rc.events.on('option.changed', ({key, value}) => {
            this.updateRaycasterOption(key, value);
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
        this.horde.linkEntity(camera);
    }

    /**
     * One of the raycaster options has changed value, we should check it here
     */
    updateRaycasterOption(key, value) {
        switch (key) {
            case 'metrics.spacing':
                this._cellSize = this._rc.options.metrics.spacing;
                break;
        }
        this.events.emit('option.changed', {key, value});
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

//            __
//  _ __ ___ / _| ___ _ __ ___ _ __   ___ ___  ___
// | '__/ _ \ |_ / _ \ '__/ _ \ '_ \ / __/ _ \/ __|
// | | |  __/  _|  __/ | |  __/ | | | (_|  __/\__ \
// |_|  \___|_|  \___|_|  \___|_| |_|\___\___||___/
//

    /**
     * returns an index associated with a reference
     * this function may retrieve a blueprint or a block definition with a reference.
     * @param ref {*} a reference
     * @return {*}
     * @private
     */
    _getRefIndex(ref) {
        const r = this._refs;
        if (ref in r) {
            return r[ref];
        } else {
            throw new Error('this reference is unknown : "' + ref + '". did you mean : "' + suggest(ref, Object.keys(r)) + '" ?');
        }
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
     * @return {DoorContext}
     */
    _buildSecretDoorContext(x, y) {
        const rc = this._rc;
        const dm = this._dm;
        const nOffsetMax = this.cellSize;
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
            sfunc: sFunction1,
            cfunc: sFunction2
        });
        dc1.data.x = x;
        dc1.data.y = y;
        dc1.data.phys = nPhysCode;
        dc1.data.secret = true;
        dc1.events.on('check', event => {
            this._checkDoorClosability(event);
        });
        let nSecurityCheck = 0;
        this._forEachNeighbor(x, y, (xc, yc, phys) => {
            if (phys === RC_CONSTS.PHYS_SECRET_BLOCK) {
                // secondary secret door
                if (++nSecurityCheck > 1) {
                    throw new Error(`this secret block has more than one secret neighbor : (${x}, ${y})`);
                }
                const dc2 = new DoorContext({
                    sdur: nSlidingDuration,
                    mdur: nMaintainDuration,
                    ofsmax: nOffsetMax,
                    sfunc: sFunction2,
                    cfunc: sFunction1,
                    ddur: nSlidingDuration
                });
                dc2.data.x = xc;
                dc2.data.y = yc;
                dc2.data.phys = phys;
                dc2.data.secret = true;
                dc2.events.on('check', event => {
                    const parentEvent = {context: dc1, cancel: false};
                    this._checkDoorClosability(parentEvent);
                    if (parentEvent.cancel) {
                        event.cancel = true;
                    } else {
                        this._checkDoorClosability(event);
                    }
                });
                dc1.data.child = dc2;
                dm.linkDoorContext(dc2);
            }
        }, CONSTS.CELL_NEIGHBOR_SIDE);
        dm.linkDoorContext(dc1);
        return dc1;
    }

    /**
     * If the cell contains an entity it will cancel the given "door close event"
     * @param payload {*}
     * @private
     */
    _checkDoorClosability(payload) {
        const {x, y} = payload.context.data;
        // TODO check with entity manager
        payload.cancel = this.horde.getEntitiesAt(x, y).length > 0;
    }

    /**
     * creates a door context for the specified cell.
     * of course the cell must describe a door, and have a phys code of type PHYS_DOOR_* or PHYS_CURT_* or PHYS_SECRET_BLOCK
     * @param x {number} cell position x
     * @param y [number} cell position y
     * @param bAutoclose {boolean} if true, then the door will auto close after a certain time (see DOOR_MAINTAIN_DURATION constant)
     * @private
     * @return {DoorContext|null} true if context could be created, false otherwise (phys code invalid)
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
                return this._buildSecretDoorContext(x, y);

            default:
                return null;
        }
        const dc = new DoorContext({
            sdur: CONSTS.DOOR_SLIDING_DURATION * fSlidingDuration | 0,
            mdur: bAutoclose ? CONSTS.DOOR_MAINTAIN_DURATION : Infinity,
            ofsmax: nOffsetMax,
            sfunc: Easing.SMOOTHSTEP
        });
        dc.data.autoclose = bAutoclose;
        dc.data.x = x;
        dc.data.y = y;
        dc.data.phys = nPhysCode;
        dc.events.on('check', event => this._checkDoorClosability(event));
        const dm = this._dm;
        dm.linkDoorContext(dc);
        return dc;
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
        try {
            const tp = this._TIME_INTERVAL;
            this._time += nTime;
            const tm = this._timeMod + nTime;
            const nTimes = Math.min(10, tm / tp | 0);
            this._timeMod = tm % tp;
            let bRender = false;
            this._filters.process(this._time);
            for (let i = 0; i < nTimes; ++i) {
                // logic doom loop here
                this._scheduler.schedule(this._time);
                this._doorProcess();
                // entity management
                // this._camera.think(this); // visor is now in the entity list : indx 0
                this._horde.process(this);
                // Seuls les thinker qui exploite les dummy (comme Tangible)
                // peuvent faire usage des secteurs et du collisionneur
                this._smasher.process();
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
        } catch (e) {
            console.error(e);
            this.stopDoomLoop();
        }
    }

    _render() {
        try {
            /**
             * The raycaster instance
             * @type {Renderer}
             */
            const rend = this._rc;
            // recompute all texture/sprite animation with a time-delta of 40ms
            rend.computeAnimations(this._TIME_INTERVAL);
            // create a new scene for these parameters
            const camera = this._camera;
            if (camera) {
                const loc = camera.position;
                // render the scene, the scene will be rendered on the internal canvas of the raycaster renderer
                rend.render(loc.x, loc.y, loc.angle, loc.z);
                this._events.emit('render');
                this._filters.render(rend.renderCanvas);
                // display the raycaster internal canvas on the physical DOM canvas
                // requestAnimationFrame is called here to v-synchronize and have a neat animation
                requestAnimationFrame(() => {
                    rend.flip(this._renderContext);
                    this._events.emit('flip');
                });
            }
        } catch (e) {
            console.error(e);
            this.stopDoomLoop();
        }
    }

    screenshot(x, y, angle, z) {
        const rc = this._rc;
        const oSaveCanvas = CanvasHelper.cloneCanvas(rc.renderCanvas);
        rc.render(x, y, angle, z);
        const oCanvas = CanvasHelper.createCanvas(this._renderCanvas.width, this._renderCanvas.height);
        rc.flip(oCanvas.getContext('2d'));
        rc._renderContext.drawImage(oSaveCanvas, 0, 0);
        return oCanvas;
    }

    /**
     * defines a rendering canvas
     * @param oCanvas {HTMLCanvasElement} the output canvas
     */
    setRenderingCanvas(oCanvas) {
        this._renderCanvas = oCanvas;
        this._renderContext = oCanvas.getContext('2d');
        return this;
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


//  _     _            _                     _   _               _
// | |__ | | ___   ___| | __  _ __ ___   ___| |_| |__   ___   __| |___
// | '_ \| |/ _ \ / __| |/ / | '_ ` _ \ / _ \ __| '_ \ / _ \ / _` / __|
// | |_) | | (_) | (__|   <  | | | | | |  __/ |_| | | | (_) | (_| \__ \
// |_.__/|_|\___/ \___|_|\_\ |_| |_| |_|\___|\__|_| |_|\___/ \__,_|___/
//

    get cellSize() {
        if (this._cellSize === undefined) {
            return this._cellSize = this._rc.options.metrics.spacing;
        }
        return this._cellSize;
    }

    /**
     * Renvoe la position du centre d'une cellule
     * @param xCell
     * @param yCell
     * @returns {Position}
     */
    getCellCenter(xCell, yCell) {
        const ps = this.cellSize;
        return new Position({
            x: xCell * ps + (ps >> 1),
            y: yCell * ps + (ps >> 1)
        });
    }

    /**
     * Renvoie les coordonnées d'une celle en fonction de la poisition texel fournie
     * @param x {number}
     * @param y {number}
     * @return {{x: number, y: number}};
     */
    clipCell(x, y) {
        const ps = this.cellSize;
        return {x: x / ps | 0, y: y / ps | 0};
    }

    /**
     * Changement d'un block (offset, code-physique, material)
     * @param x {number} positon of block to change
     * @param y {number}
     * @param ref {string} reference of the block
     */
    alterBlock(x, y, ref) {
        const rc = this._rc;
        const r = this._getRefIndex(ref);
        const m = this._materials[r];
        rc.setCellOffset(x, y, m.offset);
        rc.setCellPhys(x, y, m.phys);
        rc.setCellMaterial(x, y, r);
    }

    /**
     * resolves a block action, an action where an entity uses its "push" action on a wall
     * @param entity {Entity} entity pushing the block
     * @param x {number} block cell coordinate (x axis)
     * @param y {number} block cell coordinate (y axis)
     */
    pushCell(entity, x, y) {
        this.openDoor(x, y, true);
        this._tm.entityPushBlock(entity, x, y);
    }

    /**
     * Retreive a secretdoor next to another secret door whose coordinates are given
     * @param x
     * @param y
     * @return {null}
     * @private
     */
    _getSecretNeighborDoorContext(x, y) {
        let oChild = null;
        const dm = this._dm;
        this._forEachNeighbor(x, y, (xc, yc, phys) => {
            const dcTest = dm.getDoorContext(xc, yc);
            if (!!dcTest && dcTest.data.secret) {
                oChild = dcTest;
            }
        }, CONSTS.CELL_NEIGHBOR_SIDE);
        return oChild;
    }

    /**
     * Opens a door at a specified position. The cell at x, y must have a PHYS_DOOR_*, PHYS_CURT_* or PHYS_SECRET_BLOCK physical code
     * @param x {number} position of cell x
     * @param y {number} position of cell y
     * @param bAutoclose {boolean} if true, then the door will auto close after a certain time (see DOOR_MAINTAIN_DURATION constant)
     */
    openDoor(x, y, bAutoclose = true) {
        if (this.isDoorLocked(x, y)) {
            this.events.emit('door.locked', {x, y});
            return;
        }
        const dm = this._dm;
        // is there a door opening here ?
        if (!dm.getDoorContext(x, y)) {
            const dc = this._buildDoorContext(x, y, bAutoclose);
            if (!!dc) {
                this.events.emit('door.open', {x, y, context: dc});
                const oChild = this._getSecretNeighborDoorContext(x, y);
                if (!!oChild) {
                    oChild.events.once('closing', () => this.events.emit('door.closing', {x, y}));
                } else {
                    dc.events.once('closing', () => this.events.emit('door.closing', {x, y}));
                }
                dc.events.once('close', () => this.events.emit('door.closed', {x, y}));
            }
        }
    }

    /**
     * Lock/unlock door
     * @param x
     * @param y
     * @param bLock
     */
    lockDoor(x, y, bLock) {
        if (this.isDoor(x, y) || this.isSecretBlock(x, y)) {
            if (bLock) {
                this._locks.mark(x, y);
            } else {
                this._locks.unmark(x, y);
            }
        }
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
            const child = this._getSecretNeighborDoorContext(x, y);
            if (!!child) {
                child.events.once('close', () => dc.close());
                child.close();
            } else {
                dc.close();
            }
        }
    }

    getCellType(x, y) {
        return this._rc.getCellPhys(x, y);
    }

    /**
     * Returns true if the spécified cell is any king of door or curtain
     * Returns false otherwise (including secret block)
     * @param x {number} door coordinates (x axis)
     * @param y {number} door coordinates (y axis)
     * @return {boolean|*}
     */
    isDoor(x, y) {
        let c;
        const oDoor = this._dm.getDoorContext(x, y);
        if (!!oDoor) {
            c = oDoor.data.phys;
        } else {
            c = this._rc.getCellPhys(x, y);
        }
        return c >= RC_CONSTS.PHYS_FIRST_DOOR && c <= RC_CONSTS.PHYS_LAST_DOOR;
    }

    /**
     * Returns true if the spécified cell is secret block
     * @param x {number} door coordinates (x axis)
     * @param y {number} door coordinates (y axis)
     * @return {boolean|*}
     */
    isSecretBlock(x, y) {
        let c;
        const oDoor = this._dm.getDoorContext(x, y);
        if (!!oDoor) {
            c = oDoor.data.phys;
        } else {
            c = this._rc.getCellPhys(x, y);
        }
        return c === RC_CONSTS.PHYS_SECRET_BLOCK;
    }

    /**
     * Returns true if the cell is a door and is closed
     * @param x {number} door coordinates (x axis)
     * @param y {number} door coordinates (y axis)
     * @return {boolean|*}
     */
    isDoorClosed(x, y) {
        const oDoor = this._dm.getDoorContext(x, y);
        if (!!oDoor) {
            // if there is a door context : use it !
            return oDoor.isClosed();
        } else {
            // no door context : check cell type
            // we must use this basic check, because we dont want to validate an open door
            const c = this.getCellType(x, y);
            return (c >= RC_CONSTS.PHYS_FIRST_DOOR && c <= RC_CONSTS.PHYS_LAST_DOOR) || c === RC_CONSTS.PHYS_SECRET_BLOCK;
        }
    }

    /**
     * Returns true if the cell is a door and is open
     * @param x {number} door coordinates (x axis)
     * @param y {number} door coordinates (y axis)
     * @return {boolean|*}
     */
    isDoorOpen(x, y) {
        // an open door always has a door context
        const oDoor = this._dm.getDoorContext(x, y);
        return !!oDoor && oDoor.isDoorOpen(x, y);
    }

    /**
     * Returns true if the cell is a door and is locked
     * @param x {number} door coordinates (x axis)
     * @param y {number} door coordinates (y axis)
     * @return {boolean|*}
     */
    isDoorLocked(x, y) {
        return (this.isDoor(x, y) || this.isSecretBlock(x, y)) && this._locks.isMarked(x, y);
    }


//           _              _       _
//  ___  ___| |__   ___  __| |_   _| | ___ _ __
// / __|/ __| '_ \ / _ \/ _` | | | | |/ _ \ '__|
// \__ \ (__| | | |  __/ (_| | |_| | |  __/ |
// |___/\___|_| |_|\___|\__,_|\__,_|_|\___|_|
//



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


    _tagEnter({entity, command, parameters, remove, x, y}) {
        this._events.emit('tag.' + command + '.enter', {entity, command, operation: 'enter', parameters, remove, x, y});
    }

    _tagLeave({entity, command, parameters, remove, x, y}) {
        this._events.emit('tag.' + command + '.leave', {entity, command, operation: 'leave', parameters, remove, x, y});
    }

    _tagPush({entity, command, parameters, remove, x, y}) {
        this._events.emit('tag.' + command + '.push', {entity, command, operation: 'push', parameters, remove, x, y});
    }

    addTag(x, y, sTag) {
        this._tm.addTag(x, y, sTag);
    }

    get tagManager() {
        return this._tm;
    }

    tags(x, y) {
        const tg = this._tm._tg;
        const a = [];
        tg.cell(x, y).iterate(id => a.push(tg.getTag(id)))
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
    _useThinker(sThinker, pThinker) {
        this._thinkers[sThinker] = pThinker;
    }

    useThinkers(oThinkers, oContext = undefined) {
        if (oContext !== undefined) {
            for (let s in oContext) {
                this._thinkerContext[s] = oContext[s];
            }
        }
        for (let sThinker in oThinkers) {
            this._useThinker(sThinker, oThinkers[sThinker]);
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
            throw new Error(`this is not a collection of "${sLabel}"`);
        }
        if (sItem in oItems) {
            return oItems[sItem];
        } else {
            const aItems = Object.keys(oItems);
            if (aItems.length > 0) {
                const sSuggest = suggest(sItem, aItems);
                throw new Error(`There is no such ${sLabel} : "${sItem}". Did you mean "${sSuggest}" ?`);
            } else {
                throw new Error(`No ${sLabel} has been declared so far in the given collection`);
            }
        }
    }

    /**
     * Creates a new instance of a specified thinker class
     * @param sThinker {string} thinker class name to be instanciated, the class must have been previously register with
     * either the method _useThinker(), or the method useThinkers() (with an "s")
     * @returns {Thinker}
     */
    createThinkerInstance(sThinker) {
        try {
            if (!sThinker) {
                sThinker = 'Thinker';
            }
            const pThinker = this._getObjectItem(sThinker, this._thinkers, 'thinker');
            const oThinker = new pThinker();
            oThinker.engine = this;
            oThinker._context = this._thinkerContext;
            return oThinker;
        } catch (e) {
            console.error(e)
            throw new Error('could not instanciate thinker class "' + sThinker + '"');
        }
    }

    /**
     * Loads a tileset
     * @param ref {string} reference name
     * @param src {string} url to image
     * @param tileWidth {number} width
     * @param tileHeight {number} height
     * @param bNoShading {boolean} does not shades tileset
     * @returns {Promise<*>}
     */
    async loadTileSet(ref, src, tileWidth, tileHeight, bNoShading) {
        if (ref in this._tilesets) {
            return this._tilesets[ref];
        }
        const oImage = await CanvasHelper.loadCanvas(src);
        const tileset = this._rc.buildTileSet(oImage, tileWidth, tileHeight, bNoShading);
        this._tilesets[ref] = tileset;
        return tileset;
    }

    getTileSet(ref) {
        if (ref in this._tilesets) {
            return this._tilesets[ref];
        } else {
            return null;
        }
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
        const bNoShading = ('fx' in bpDef) && bpDef.fx.includes(RC_CONSTS.FX_LIGHT_SOURCE);
        const tileset = await this.loadTileSet(bpDef.tileset, src, tileWidth, tileHeight, bNoShading);
        const bp = new Blueprint();
        bp.tileset = tileset;
        if (('thinker' in bpDef) && !!bpDef.thinker) {
            bp.thinker = bpDef.thinker; // state object : should not be instanciate yet
        } else {
            bp.thinker = "Thinker";
        }
        if ('animations' in tsDef) {
            const bpa = {};
            tsDef.animations.forEach(a => {
                bpa[a.id] = {
                    start: a.start,
                    length: a.length,
                    loop: a.loop,
                    duration: a.duration,
                    iterations: a.iterations
                };
            });
            bp.animations = bpa;
        }
        if ('data' in bpDef) {
            bp.data = bpDef.data;
        }
        bp.size = bpDef.size;
        bp.lightsource = bpDef.lightsource;
        bp.fx = bpDef.fx || [];
        bp.scale = bpDef.scale || 1;
        bp.ref = bpDef.ref;
        return this._blueprints[resref] = bp;
    }


//             _   _ _                                                                       _
//   ___ _ __ | |_(_) |_ _   _   _ __ ___   __ _ _ __   __ _  __ _  ___ _ __ ___   ___ _ __ | |_
//  / _ \ '_ \| __| | __| | | | | '_ ` _ \ / _` | '_ \ / _` |/ _` |/ _ \ '_ ` _ \ / _ \ '_ \| __|
// |  __/ | | | |_| | |_| |_| | | | | | | | (_| | | | | (_| | (_| |  __/ | | | | |  __/ | | | |_
//  \___|_| |_|\__|_|\__|\__, | |_| |_| |_|\__,_|_| |_|\__,_|\__, |\___|_| |_| |_|\___|_| |_|\__|
//                       |___/                               |___/

    /**
     * Will create a new Entity and will link it into the engine entity collection
     * linkEntity() is automatically called
     * @param resref {string} resource reference OR id of the blueprint, to create the entity
     * @param position {Position}
     * @returns {Entity}
     */
    createEntity(resref, position) {
        const rc = this._rc;
        if (resref in this._refs) {
            resref = this._refs[resref];
        }
        if (!(resref in this._blueprints)) {
            const aWarn = [resref + ' is not a valid resource reference !'];
            const aObjects = Object.keys(this._blueprints);
            if (aObjects.length > 0) {
                aWarn.push('Did you mean : "' + suggest(resref, aObjects) + '" (blueprint) ?');
            }
            const aRefs = Object.keys(this._refs);
            if (aRefs.length > 0) {
                aWarn.push('Did you mean : "' + suggest(resref, aRefs) + '" (refs) ?');
            }
            throw new Error('this blueprint does not exist : "' + resref + '".');
        }
        const bp = this._blueprints[resref];
        const entity = new Entity();

        // ref
        if ('ref' in bp) {
            entity.ref = bp.ref;
        }

        // position
        entity.position.set(position);

        // sprite
        const sprite = rc.buildSprite(bp.tileset);
        if ('scale' in bp) {
            sprite.scale = bp.scale;
        }

        // visual effects
        bp.fx.forEach(fx => sprite.addFlag(fx));

        // animations
        const animations = bp.animations;
        if (animations) {
            // instantiates animations
            for (let iAnim in animations) {
                sprite.buildAnimation(animations[iAnim], iAnim);
            }
        }

        // thinker
        entity.thinker = this.createThinkerInstance(bp.thinker);
        entity.sprite = sprite;
        entity.size = bp.size;
        entity.data = {
            ...bp.data
        };

        // dynamic light
        if (!!bp.lightsource) {
            this.linkEntityLightSource(
                entity,
                parseFloat(bp.lightsource.v),
                parseFloat(bp.lightsource.r0),
                parseFloat(bp.lightsource.r1)
            );
        }

        this._horde.linkEntity(entity);
        this._smasher.updateEntity(entity)
        this.events.emit('entity.created', {entity});
        return entity;
    }

    destroyEntity(e) {
        if (this._horde.isEntityLinked(e)) {
            if (e.lightsource) {
                e.lightsource.remove();
            }
            this._rc.disposeSprite(e.sprite);
            this._smasher.unregisterDummy(e);
            this._horde.unlinkEntity(e);
            this.events.emit('entity.destroyed', {entity: e});
        }
    }

    /**
     * Adds a lightsource to an entity
     * @param entity {Entity}
     * @param intensity {number} light source intensity
     * @param innerRadius {number} light source inner radius
     * @param outerRadius {number} light source outer radius
     */
    linkEntityLightSource(entity, intensity, innerRadius, outerRadius) {
        const position = entity.position;
        entity.lightsource = this.createLightSource(
            position.x,
            position.y,
            innerRadius,
            outerRadius,
            intensity
        );
    }

    /**
     * synchronize dummy position and size with its entity
     * @param entity {Entity}
     * @private
     */
    _syncEntityDummy(entity) {
        const dummy = entity.dummy;
        const position = entity.position;
        dummy.radius = entity.size;
        dummy.position.set(position.x, position.y);
    }

    /**
     * What to do when an entity is smashed by one or more other entities
     * @param oEntity {Entity}
     * @param aSmashers {Entity[]}
     * @private
     */
    _smashEntity(oEntity, aSmashers) {
        this.events.emit('entity.hit', {entity: oEntity, hits: aSmashers});
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
     * @param extra {null|{startpoint: number, blueprints: [], tilesets: []}} common blueprints and tilesets definition
     * @return {Promise<void>}
     */
    async buildLevel(data, extra = null) {
        // validation json
        if (extra === null) {
            extra = {startpoint: 0, blueprints: [], tilesets: []};
        }
        try {
            jsonValidate(data, SCHEMA_RCE_100);
        } catch (e) {
            console.error(data)
            throw e
        }

        this._refs = {};

        if (typeof extra === 'object') {
            if ('blueprints' in extra) {
                extra.blueprints.forEach(bp => data.blueprints.push(bp));
            }
            if ('tilesets' in extra) {
                extra.tilesets.forEach(ts => data.tilesets.push(ts));
            }
        }
        const BLUEPRINT_COUNT = data.blueprints.length; // Object.keys(data.blueprints).length;
        const DECAL_COUNT = Object.keys(data.decals).length;
        const LS_COUNT = Object.keys(data.lightsources).length;
        const TAG_COUNT = data.tags ? 1 : 0;
        const TEXTURE_COUNT = 3;
        const ALL_COUNT = TEXTURE_COUNT + BLUEPRINT_COUNT + DECAL_COUNT + TAG_COUNT + LS_COUNT;

        const feedback = (phase, progress) => {
            this._events.emit('level.loading', {phase, progress});
        };
        feedback('init', 0);
        this._locks = new MarkerRegistry();
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

        CanvasHelper.setDefaultImageSmoothing(data.level.textures.smooth);

        if ('shading' in data) {
            oRCOptions.shading = data.shading;
        }

        rc.options = oRCOptions;

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
            const oThatBP =  data.blueprints[i];
            showProgress('creating blueprints');
            const resref = oThatBP.id;
            const oBP = await this.createBlueprint(resref, oThatBP, data);
            if (typeof oBP.ref === 'string' && oBP.ref.length > 0) {
                this._refs[oBP.ref] = resref;
            }
            ++nBp;
        }

        this._materials = {};
        if (data.level.legend) {
            const mh = new MapHelper();
            mh.build(rc, data.level);
            const materials = mh.materials;
            for (let i in materials) {
                const m = materials[i];
                if (typeof m.ref === 'string' && m.ref.length > 0) {
                    this._refs[m.ref] = i;
                    this._materials[i] = Extender.objectExtends({}, {
                        faces: m.faces,
                        phys: m.phys,
                        offset: m.offset
                    }, true);
                }
            }
        }

        const nMapSize = this._rc.getMapSize();
        this._tm.setMapSize(nMapSize);
        this.horde.setMapSize(nMapSize);
        // sync with tag grid
        const ps = this.cellSize;
        this.horde.setSectorSize(ps);
        this._smasher.grid.width = nMapSize * ps / this._smasher.getCellWidth();
        this._smasher.grid.height = nMapSize * ps / this._smasher.getCellHeight();

        // static objects
        data.objects.forEach(o => {
            const entity = this.createEntity(o.blueprint, o);
            if ('animation' in o && o.animation !== false && o.animation !== null) {
                entity.sprite.setCurrentAnimation(o.animation, 0);
            }
            entity.visible = true;
        });

        // CAMERA : sets initial visor position, and orientation
        // is there a valid start point
        const bExtraData = extra !== null;
        const bStartPointDefined = bExtraData && ('startpoint' in extra);
        const bStartPointValid = bExtraData && (extra.startpoint >= 0) && (extra.startpoint < data.startpoints.length)
        const bValidStartpoint = bExtraData &&        // extra must be defined
            bStartPointDefined &&                      // extra must have startpoint property
            bStartPointValid;   // within the startpoints array range
        const nInitialStartPoint = bValidStartpoint ? extra.startpoint : 0;
        const {x, y, z, angle} = data.startpoints[nInitialStartPoint];
        this.camera.position.set({
            x: x * ps + (ps >> 1), // visor coordinates (x-axis)
            y: y * ps + (ps >> 1), // visor coordinates (y-axis)
            angle, // looking angle
            z: z // visor altitude (1 is the default object)
        });
        this.camera.thinker = this.createThinkerInstance(data.camera.thinker || this._config.cameraThinker);
        this._startpoints = data.startpoints;

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
                return this.loadTileSet(ref, src, width, height, false);
            } catch(e) {
                Promise.reject(e.message);
            }
        };


        const installDecal = async (decal, face) => {
            const xCell = decal.x;
            const yCell = decal.y;
            if (face in decal) {
                const iFace = FACES.indexOf(face);
                const {align, tileset, tile = 0} = decal[face];
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
                    oCanvas
                        .getContext('2d')
                        .drawImage(
                            ts._originalImage,
                            tile * wTile,
                            0,
                            wTile,
                            hTile,
                            xd,
                            yd,
                            wTile,
                            hTile
                        );
                })
            }
        };

        /**
         * used to prevent progressbar from being stuck
         * @param t {number}
         * @return {Promise<unknown>}
         */
        const miniPause = t => new Promise(resolve => {
            setTimeout(() => resolve(), t);
        });

        // DECALS
        for (let iDecal = 0, nDecalLength = data.decals.length; iDecal < nDecalLength; ++iDecal) {
            const decal = data.decals[iDecal];
            await installDecal(decal, 'n');
            await installDecal(decal, 'e');
            await installDecal(decal, 'w');
            await installDecal(decal, 's');
            await installDecal(decal, 'f');
            await installDecal(decal, 'c');
            await miniPause(16);
            showProgress('applying decals');
        }

        // LIGHTSOURCES
        for (let iLS = 0, nLS = data.lightsources.length; iLS < nLS; ++iLS) {
            const ls = data.lightsources[iLS];
            this.createLightSource(ls.x, ls.y, ls.r0, ls.r1, ls.v);
            showProgress('creating lightsources');
        }

        // TAGS
        showProgress('analyzing tags');
        for (let iTag = 0, nTagLength = data.tags.length; iTag < nTagLength; ++iTag) {
            const tagEntry = data.tags[iTag];
            tagEntry.tags.forEach(t => this.addTag(tagEntry.x, tagEntry.y, t));
        }

        feedback('done', 1);
        this.events.emit('level.load');
    }



//       _        _         _    __
//   ___| |_ __ _| |_ ___  (_)  / /__
//  / __| __/ _` | __/ _ \ | | / / _ \
//  \__ \ || (_| | ||  __/ | |/ / (_) |
//  |___/\__\__,_|\__\___| |_/_/ \___/

    getEngineState() {
        return {
            doors: this.getDoorManagerState(),
            locks: this._locks.state,
            tags: this._tm.grid.state,
            time: this.getTime()
        }
    }

    setEngineState(value) {
        const {doors, locks, tags, time} = value;
        this._time = time;
        this._tm.grid.state = tags;
        this._locks.state = locks;
        this.setDoorManagerState(doors);
    }

    getDoorManagerState() {
        return this._dm.state;
    }

    setDoorManagerState(value) {
        value.forEach(({x, y, time, phase, autoclose}) => {
            this.openDoor(x, y, autoclose);
            const dc = this._dm.getDoorContext(x, y);
            dc.state = {time, phase};
        })
    }
}

export default Engine;
