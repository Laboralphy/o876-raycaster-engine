import * as CONSTS from "./consts/index";
import * as RC_CONSTS from "../raycaster/consts/index";

import DoorManager from "./DoorManager";
import DoorContext from "./DoorContext";
import Scheduler from "./Scheduler";
import Horde from "./Horde";
import Location from "./Location";
import Easing from "../tools/Easing";
import Entity from "./Entity";
import Blueprint from "./Blueprint";
import util from "util";
import CanvasHelper from "../tools/CanvasHelper";
import Translator from "../tools/Translator";
import Renderer from "../raycaster/Renderer";
import MapHelper from "../raycaster/MapHelper";
import Camera from "./Camera";

class Engine {
    constructor() {
        // to be instanciate for each level
        this._rc = null;
        this._dm = null;
        this._scheduler = null;
        this._horde = null;
        this._camera = null;
        this._entities = null;
        this._blueprints = null;
        this._time = 0;
        this._interval = null;

        // instanciate at construct
        this._thinkers = {};
        this._TIME_INTERVAL = 40;
        this._timeMod = 0;
        this._renderContext = null;
    }

    /**
     * This will setup the renderer and all associated structures
     */
    initializeRenderer() {
        this._rc = new Renderer();
        this._dm = new DoorManager();
        this._scheduler = new Scheduler();
        this._horde = new Horde();
        this._camera = new Camera();
        this._entities = [];
        this._blueprints = {};
        this._timeMod = 0;
        this._time = 0;
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
        dc.event.on('check', event => this._checkDoorClosability(event));
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
            this._horde.process();
            // special effect management
            bRender = true;
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
            const scene = rend.computeScene(loc.x, loc.y, loc.angle, loc.z);
            // render the scene, the scene will be rendered on the internal canvas of the raycaster renderer
            rend.render(scene);
            // display the raycaster internal canvas on the physical DOM canvas
            // requestAnimationFrame is called here to v-synchronize and have a neat animation
            requestAnimationFrame(() => rend.flip(this._renderContext));
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
    delayCommand(nTime, pCommand) {
        return this._scheduler.delayCommand(pCommand, nTime);
    }

	/**
	 * Cancels a previously delayed command.
	 * @param id {number} identifier produced by the delayCommand function
	 */
    cancelCommand(id) {
        this._scheduler.cancelCommand(id);
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
    declareThinker(sThinker, pThinker) {
        this._thinkers[sThinker] = pThinker;
    }

    declareThinkers(oThinkers) {
        for (let sThinker in oThinker) {
            this.declareThinker(sThinker, oThinker[sThinker]);
        }
    }

    createThinkerInstance(sThinker) {
        if (!sThinker) {
            return null;
        }
        const thinkers = this._thinkers;
        if (sThinker in thinkers) {
            const pThinker = thinkers[sThinker];
            return new pThinker();
        } else {
            const aThinkerNames = Object.keys(thinkers);
            if (aThinkerNames.length > 0) {
                throw new Error(util.format('There is no such thinker : "%s". Did you mean "%s" ?', sThinker, suggest(sThinker, aThinkerNames)));
            } else {
                throw new Error('No thinkers have been declared so far');
            }
        }
    }

    /**
     * Creates a blueprint, using an image which is loaded asynchronously, thus the promise.
     * @param resref {string} new blueprint reference
     * @param data {*} the blueprint structure
     * @returns {Promise<void>}
     */
    async createBlueprint(resref, data) {
        const bpDef = data.blueprints[resref];
        const rc = this._rc;
        const tsDef = data.tilesets[bpDef.tileset];
        const src = tsDef.src;
        const tileWidth = tsDef.width;
        const tileHeight = tsDef.height;
        const oImage = await CanvasHelper.loadCanvas(src);
        const tileset = rc.buildTileSet(oImage, tileWidth, tileHeight);
        const bp = new Blueprint();
        bp.tileset = tileset;
        if ('thinker' in bpDef) {
            bp.thinker = bpDef.thinker; // state object : should not be instanciate yet
        }
        if ('animations' in tsDef) {
            bp.animations = tsDef.animations
        }
        this._blueprints[resref] = bp;
        return bp;
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
    createEntity(resref) {
        const rc = this._rc;
        const bp = this._blueprints[resref];
        const entity = new Entity();
        const sprite = rc.buildSprite(bp.tileset);
        const animations = bp.animations;
        if (animations) {
            // instantiates animations
            for (let iAnim in animations) {
                sprite.buildAnimation(animations[iAnim]);
            }
        }
        entity._thinker = this.createThinkerInstance(bp.thinker);
        entity._sprite = sprite;
        return entity;
    }

    /**
     * checks if an entity is linked into the engine.
     * only linked entities are thinked and rendered
     * @param entity {Entity}
     * @returns {boolean}
     */
    isEntityLinked(entity) {
        return this._entities.indexOf(entity) >= 0;
    }

    /**
     * Add an entity into the engine
     * only linked entities are thinked and rendered
     * @param entity {Entity}
     */
    linkEntity(entity) {
        if (!this.isEntityLinked(entity)) {
            this._entities.push(entity);
        }
    }

    /**
     * Remove an entity from the engine
     * only linked entities are thinked and rendered
     * @param entity {Entity}
     */
    unlinkEntity(entity) {
        const aEntities = this._entities;
        const iEntity = aEntities.indexOf(entity);
        if (iEntity >= 0) {
            aEntities.splice(iEntity, 1);
        }
    }




//    _
//   (_)___  ___  _ __    _ __   __ _ _ __ ___  ___
//   | / __|/ _ \| '_ \  | '_ \ / _` | '__/ __|/ _ \
//   | \__ \ (_) | | | | | |_) | (_| | |  \__ \  __/
//  _/ |___/\___/|_| |_| | .__/ \__,_|_|  |___/\___|
// |__/                  |_|


    async buildLevel(data, monitor) {
        const BLUEPRINT_COUNT = Object.keys(data.blueprints).length;
        const TEXTURE_COUNT = 3;
        const ALL_COUNT = TEXTURE_COUNT + BLUEPRINT_COUNT;

        const feedback = !!monitor ? monitor : (phase, progress) => {};
        feedback('init', 0);
        const oTranslator = new Translator();
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
        ;
        data = oTranslator.translateStructure(data);

        this.initializeRenderer();
        const rc = this._rc;
        const cvs = this.getRenderingCanvas();
        rc.defineOptions({
            metrics: data.level.metrics,
            screen: {
                width: cvs.width,
                height: cvs.height
            }
        });
        // defines sky, walls and flats
        feedback('loading textures', 1 / ALL_COUNT);
        rc.setBackground(await CanvasHelper.loadCanvas(data.level.sky));
        feedback('loading textures', 2 / ALL_COUNT);
        rc.setWallTextures(await CanvasHelper.loadCanvas(data.level.walls));
        feedback('loading textures', 3 / ALL_COUNT);
        rc.setFlatTextures(await CanvasHelper.loadCanvas(data.level.flats));

        // creates blueprints
        let nBp = TEXTURE_COUNT;
        for (let resref in data.blueprints) {
            feedback('creating blueprints',  nBp / ALL_COUNT);
            await this.createBlueprint(resref, data);
            ++nBp;
        }

        if (data.level.legend) {
            const mh = new MapHelper();
            mh.build(rc, data.level);
        } else {

        }
        feedback('done',  1);
    }

}

export default Engine;
