import ShadedTileSet from './ShadedTileSet';
import MarkerRegistry from '../tools/MarkerRegistry';
import CellSurfaceManager from './CellSurfaceManager';
import CanvasHelper from '../tools/CanvasHelper';
import * as CONSTS from './consts';
import Reactor from "../tools/Reactor";
import ArrayHelper from '../tools/ArrayHelper';
import Translator from "../tools/Translator";
import TileAnimation from "./TileAnimation";
import Sprite from './Sprite';
import ObjectExtender from "../tools/ObjectExtender";
import GeometryHelper from '../tools/GeometryHelper';
import DebugDisplay from "./DebugDisplay";

/**
 * @todo VR rendering
 */

/**
 * comparison between two items of buffer.
 * compares the [9] (distance between camera and column)
 * before the [5] (destination position x on screen)
 * @param a {array}
 * @param b {array}
 * @returns {number}
 */
function zBufferCompare(a, b) {
    if (a[9] !== b[9]) {
        return b[9] - a[9];
    }
    return a[5] - b[5];
}




class Renderer {
	
	constructor() {
	    this.configProperties();
        this.configOptions();
        this.configTranslator();
        this.resetFlatContext();
	}

	resetFlatContext() {
        this._flatContext = {
            image: undefined,
            imageData: undefined,
            imageData32: undefined,
            renderSurface: undefined,
            renderSurface32: undefined
        };
    }

    configProperties() {
        this._map = [];
        this._walls = null; // wall shaded tileset
        this._flats = null; // flat shaded tileset
        this._background = null; // background image
        this._csm = new CellSurfaceManager();
        this._cellCodes = []; // this is an array of array of sides

        this._bgOffset = 0; // oofset between camera and background position
        this._bgCameraOffset = 0; // oofset between camera and background position

        this._animations = [];
        this._storey = null;     // instance of another renderer for the first floor
        this._sprites = [];     // list of sprites
        this._tilesets = [];    // list of tilesets
        this._debugDisplay = new DebugDisplay();
        this._renderContext = null;
        this._renderCanvas = null;
        this._offsetTop = 50; // Y offset of rendering
    }

    configOptions() {
        this._options = {
            metrics: {
                height: 96,         // wallXed height of walls
                spacing: 64         // size of a cell, on the floor
            },
            screen: {               // the virtual screen where the world is rendered
                width: 256,         // horizontal screen size (in pixels)
                height: 256,	    // vertical screen size (in pixels)
                focal: 128,
                canvas: null,
                vr: false
            },
            shading: {
                color: 'black', // (*) fog color
                factor: 50,     // (*) distance where the texture shading increase by one unit
                brightness: 0,	// (*) base brightness
                filter: false,  // (*) color filter for sprites (ambient color)
                shades: 16,  // (*) number of shading nuance
            },
            textures: {
                smooth: false,      // set texture smoothing on or off
                stretch: false,     // (*) second storey is x2 height
                files: {
                    walls: '',          // (*) wall textures
                    flats: '',          // (*) flat textures
                    background: ''      // (*) background images
                }
            },
        };
        this._optionsReactor = new Reactor(this._options);
    }

    configTranslator() {
	    const t = new Translator();
	    t.addRule('shading.color', 'shading-settings');
        t.addRule('shading.brightness', 'shading-settings');
        t.addRule('shading.filter', 'shading-settings');
        t.addRule('shading.shades', 'shading-settings');
        this._translator = t;
    }

    get debug() {
	    return this._debugDisplay;
    }

    get options() {
	    return this._options;
    }

    adaptFocal() {
	    const SCREEN = this._options.screen;
	    SCREEN.focal = (SCREEN.width >> 1) * (16 / 9);
    }




//      _            _ _                        _ _   _                   _   _
//   __| | ___  __ _| (_)_ __   __ _  __      _(_) |_| |__     ___  _ __ | |_(_) ___  _ __  ___
//  / _` |/ _ \/ _` | | | '_ \ / _` | \ \ /\ / / | __| '_ \   / _ \| '_ \| __| |/ _ \| '_ \/ __|
// | (_| |  __/ (_| | | | | | | (_| |  \ V  V /| | |_| | | | | (_) | |_) | |_| | (_) | | | \__ \
//  \__,_|\___|\__,_|_|_|_| |_|\__, |   \_/\_/ |_|\__|_| |_|  \___/| .__/ \__|_|\___/|_| |_|___/
//                             |___/                               |_|

    /**
     * builds a list of mutated options
     * @return {array}
     */
    buildMutatedOptionList() {
        const t = this._translator;
        const l = this._optionsReactor
            .getLog()
            .map(x => t.translate(x));
        return ArrayHelper.uniq(l);
    }

    optionsHaveMutated() {
        return this
            ._optionsReactor
            .getLog()
            .length > 0;
    }


    /**
     * Transmit an option value from _options to storey._options
     * @param sOption {string}
     */
    transmitOptionToStorey(sOption) {
        if (this.storey) {
            ObjectExtender.objectSet(this.storey._options, sOption, ObjectExtender.objectGet(this._options, sOption));
        }
    }


    /**
     * reads the mutations that occurs on the option object
     * and recomputes that need to be recomputed
     */
    async optionsReaction() {
        const aList = this.buildMutatedOptionList();
        this._optionsReactor.clear();
	    const l = aList.length;
        const o = this._options;
        const SHADING = o.shading;
	    for (let i = 0; i < l; ++i) {
	        let opt = aList[i];
	        switch (opt) {

                case 'screen.height':
                case 'screen.width':
                    if (!this._renderCanvas) {
                        this._renderCanvas = CanvasHelper.createCanvas(o.screen.width, o.screen.height);
                    }
                    this._renderCanvas.width = o.screen.width;
                    this._renderCanvas.height = o.screen.height;
                    this._offsetTop = (o.screen.width - o.screen.height) >>> 1;
                    this._renderContext = this._renderCanvas.getContext('2d');
                    this.adaptFocal();
                    CanvasHelper.setImageSmoothing(this._renderCanvas, o.textures.smooth);
                    this.transmitOptionToStorey(opt);
                    this.connectStoreyProperties();
                    break;

                case 'screen.focal':
                    this.transmitOptionToStorey(opt);
                    break;

                case 'metrics.spacing':
                case 'metrics.height':
                    this.transmitOptionToStorey(opt);
                    break;

                case 'shading-settings':
                    this.setShadingSettings(
                        SHADING.shades,
                        SHADING.color,
                        SHADING.filter,
                        SHADING.brightness
                    );
                    break;

                case 'textures.files.walls':
                    if (o.textures.files.walls !== '') {
                        const wallImage = await CanvasHelper.loadCanvas(o.textures.files.walls);
                        this.setWallTextures(wallImage);
                        this.setWallShadingSettings(
                            SHADING.shades,
                            SHADING.color,
                            SHADING.filter,
                            SHADING.brightness
                        );
                    }
                    break;

                case 'textures.files.flats':
                    if (o.textures.files.flats !== '') {
                        const flatImage = await CanvasHelper.loadCanvas(o.textures.files.flats);
                        this.setFlatTextures(flatImage);
                        this.setFlatShadingSettings(
                            SHADING.shades,
                            SHADING.color,
                            SHADING.filter,
                            SHADING.brightness
                        );
                    }
                    break;

                case 'textures.files.background':
                    if (o.textures.files.background !== '') {
                        const bgImage = await CanvasHelper.loadCanvas(o.textures.files.background);
                        CanvasHelper.setImageSmoothing(bgImage, false);
                        this.setBackground(bgImage);
                    }
                    break;
            }
        }
    }

/*
                    _     _       _       __ _       _ _   _
__      _____  _ __| | __| |   __| | ___ / _(_)_ __ (_) |_(_) ___  _ __
\ \ /\ / / _ \| '__| |/ _` |  / _` |/ _ \ |_| | '_ \| | __| |/ _ \| '_ \
 \ V  V / (_) | |  | | (_| | | (_| |  __/  _| | | | | | |_| | (_) | | | |
  \_/\_/ \___/|_|  |_|\__,_|  \__,_|\___|_| |_|_| |_|_|\__|_|\___/|_| |_|

*/

    defineOptions(opt) {
        ObjectExtender.objectExtends(this._options, opt);
    }

    /**
     * creates an intance of a new renderer, to render the second storey
     */
    createStorey() {
        const storey = new Renderer();
        this._storey = storey;
        storey.setMapSize(this.getMapSize());
        this.connectStoreyProperties();
        return storey;
    }

    get storey() {
        return this._storey;
    }

    /**
     * copies properties from lower storey to upper
     */
    connectStoreyProperties() {
        const storey = this._storey;
        if (!!storey) {
            storey._walls = this._walls;
            storey._flats = this._flats;
            storey._animations = this._animations;
            storey._cellCodes = this._cellCodes;
            storey._renderContext = this._renderContext;
            storey._renderCanvas = this._renderCanvas;
            storey._offsetTop = this._offsetTop;
        }
    }


	/**
	 * Defines the wall textures.
	 * @param oImage {HTMLCanvasElement|HTMLImageElement} this image contains all wall textures and must be fully charged
	 */
    setWallTextures(oImage) {
        let width = this._options.metrics.spacing;
        let height = this._options.metrics.height;
        CanvasHelper.setDefaultImageSmoothing(this._options.textures.smooth);
        this._walls = this.buildTileSet(
            oImage,
            width,
            height
        );
        this.connectStoreyProperties();
    }

    /**
     * Defines the flat textures.
     * @param oImage {HTMLCanvasElement|HTMLImageElement} this image contains all flat textures and must be fully charged
     */
    setFlatTextures(oImage) {
        let width = this._options.metrics.spacing;
        CanvasHelper.setDefaultImageSmoothing(this._options.textures.smooth);
        this._flats = this.buildTileSet(
            oImage,
            width,
            width
        );
        this.connectStoreyProperties();
    }

    /**
     * Background is an image painted under the screen slices
     * @param oImage
     */
    setBackground(oImage) {
        this._background = oImage;
    }

    /**
	 * builds a tileset of texture, out of an image
     * @param oImage {Image|HTMLCanvasElement}
     * @param width {number}
     * @param height {number}
     */
    buildTileSet(oImage, width, height) {
        const sw = new ShadedTileSet();
        sw.setShadingLayerCount(this._options.shading.shades);
        sw.setImage(oImage, width, height);
        this._tilesets.push(sw);
        return sw;
    }

    setWallShadingSettings(nShades, sFogColor, sFilter, fBrightness) {
        this._walls.setShadingLayerCount(nShades);
        this._walls.compute(sFogColor, sFilter, fBrightness);
    }

    setFlatShadingSettings(nShades, sFogColor, sFilter, fBrightness) {
        this._flats.setShadingLayerCount(nShades);
        this._flats.compute(sFogColor, sFilter, fBrightness);
        this.resetFlatContext();
        this._flatContext.image = this._flats.getImage();
    }


    /**
	 * Defines the shading settings
     * @param nShades {number} number of layer in the shading precomputatiuon
     * @param sFogColor {string} color of the fog
     * @param sFilter {string|boolean} color of the ambient lighting
     * @param fBrightness {number} base texture light diffusion, if 0, then wall are not emitting light
     */
	setShadingSettings(nShades, sFogColor, sFilter, fBrightness) {
        this.setWallShadingSettings(nShades, sFogColor, sFilter, fBrightness);
        this.setFlatShadingSettings(nShades, sFogColor, sFilter, fBrightness);
        this._csm.shadeAllSurfaces(nShades, sFogColor, sFilter, fBrightness);
        this.shadeTileSets(nShades, sFogColor, sFilter, fBrightness);
	}

    /**
	 * Adjust map size to match the given value
	 * map is always square shaped
     * @param nSize {number} new map size
     */
	setMapSize(nSize) {
		let m = this._map;
        while (m.length > nSize) {
            m.pop();
        }
        while (m.length < nSize) {
            m.push([]);
        }
        m.forEach(row => {
            while (row.length > nSize) {
                row.pop();
            }
            while (row.length < nSize) {
                row.push(0);
            }
		});
        this._csm.setMapSize(nSize, nSize);
        if (this._storey) {
            this._storey.setMapSize(nSize);
        }
	}

    /**
     * Returns the size of the map (always square shaped)
     * @returns {number}
     */
	getMapSize() {
		return this._map.length;
	}

    /**
     * Associate a cell code with all textures (walls and flats)
     * @param nCode {number}
     * @param aTiles {{n, e, s, w, f, c}} structure of reference to wall tiles and flat tiles
     * the structure of the aTiles parameter :
     * {n: north-surface-wall, e: east-surface-wall, s: south-surface-wall, w: west-surface-wall, f: floor-surface, c: ceil-surface}
     */
    registerCellMaterial(nCode, {n, e, s, w, f, c}) {
        this._cellCodes[nCode] = [w, s, e, n, f, c];
    }



    /*
                                      _   _                                  _              _   _
     _ __ ___   __ _ _ __    ___  ___| |_| |_ ___ _ __ ___    __ _ _ __   __| |   __ _  ___| |_| |_ ___ _ __ ___
    | '_ ` _ \ / _` | '_ \  / __|/ _ \ __| __/ _ \ '__/ __|  / _` | '_ \ / _` |  / _` |/ _ \ __| __/ _ \ '__/ __|
    | | | | | | (_| | |_) | \__ \  __/ |_| ||  __/ |  \__ \ | (_| | | | | (_| | | (_| |  __/ |_| ||  __/ |  \__ \
    |_| |_| |_|\__,_| .__/  |___/\___|\__|\__\___|_|  |___/  \__,_|_| |_|\__,_|  \__, |\___|\__|\__\___|_|  |___/
                    |_|                                                          |___/
    */
    /**
     * changes the texture code of a cell
     * @param x {number}
     * @param y {number}
     * @param code {number}
     */
    setCellMaterial(x, y, code) {
        let my = this._map[y];
        my[x] = my[x] & 0xFFFFF000 | (code & 0xFFF);
    }

    /**
     * changes the physical code of a cell
     * @param x {number}
     * @param y {number}
     * @param code {number}
     */
    setCellPhys(x, y, code) {
        let my = this._map[y];
        my[x] = my[x] & 0xFFFF0FFF | (code << 12);
    }


    /**
     * changes the offset of a cell
     * @param x {number}
     * @param y {number}
     * @param code {number}
     */
    setCellOffset(x, y, code) {
        let my = this._map[y];
        my[x] = my[x] & 0xFF00FFFF | (code << 16);
    }
    /**
	 * returns the cell texture code
     * @param x
     * @param y
     * @returns {number}
     */
	getCellMaterial(x, y) {
        return this._map[y][x] & 0xFFF;
	}

    /**
	 * returns the cell physical property
     * @param x {number}
     * @param y {number}
	 * @return {number}
     */
	getCellPhys(x, y) {
        return this._map[y][x] >> 12 & 0xF;
	}

    /**
	 * returns the cell offset
     * @param x {number}
     * @param y {number}
     * @returns {number}
     */
    getCellOffset(x, y) {
        return this._map[y][x] >> 16 & 0xFF;
    }


    /**
     * Returns the index of the tile that is shown on the given cell surface.
     * This index is used to retrieve the portion of texture to be drawn
     * @param code {number} code of the cell
     * @param nSide {number} side of the surface
     * @returns {*}
     */
    getSurfaceTileIndex(code, nSide) {
        const xTile = this._cellCodes[code][nSide];
        return typeof xTile === 'object' ? xTile.frame() : xTile;
    }








    /**
     * Creates a raycasting scene
     * @return {*}
     */
    createScene(xCamera, yCamera, fDirection, fHeight = 1) {
        const SCREEN = this._options.screen;
        let oStorey = null;
        if (!!this._storey) {
            oStorey = this._storey.createScene(xCamera, yCamera, fDirection, fHeight + 2);
        }
        const focal = SCREEN.focal;
        const w = SCREEN.width;
        const fov = Math.atan2(w >> 1, focal);
        return {         // raycasting scene
            camera: {
                x: xCamera,             // camera position
                y: yCamera,             // ...
                focal,
                fov,
                direction: fDirection,              // camera direction angle
                height: fHeight              // camera view height
            },
            resume: {           // resume context
                b: false,       // next castRay must resume !
                xi: 0,          // cell position of resuming
                yi: 0           // ...
            },
            exterior: false,    // the last ray hit an exterior line
            distance: 0,        // the last computed distance (length of the last computed ray)
            maxDistance: 100,   // maximum length of a ray. if a distance is greater than this value, the ray is not rendered
            spacing: this._options.metrics.spacing,   // cell size
            cellCode: 0,        // code of the last hit cell
            xCell: 0,           // position of the last hit cell
            yCell: 0,           // ...
            wallSide: 0,        // side number of the wall of the last hitCell
            wallXed: false,     // if true then the hit cell wall is X-axed
            wallColumn: 0,      // index of the column of the last hit wall
            zbuffer: null,      // zbuffer to be drawn
            storeyScene: oStorey, // first story scene
            vr: SCREEN.vr,
            xFrom: SCREEN.vr ? (w >> 1) - (w >> 2) : 0,
            xTo: SCREEN.vr ? (w >> 1) + (w >> 2) : w
        };
    }


    /**
     * optimizes buffer by gathering screen-slices that look alike (same texture, same size, same origin-column)
     * so it should reduce the number of screen-slices, and may replace several look-alike thin screen slice by a thicker one
     * this function returns another array with fewer items, if optimization worked well.
     * @param zb {array}
     * @returns {Array}
     * @private
     */
    static _optimizeBuffer(zb) {
        // Optimisation ZBuffer -> suppression des renderScreenSlice inutile, élargissement des renderScreenSlice utiles.
        // si le last est null on le rempli
        // sinon on compare last et current
        // si l'un des indices 0, 1 diffèrent alors on flush, sinon on augmente le last
        let aZ = [];
        let nLast = 1;
        let nLLast = 1;
        let nLLLast = 1;
        let z = 1;

        // image 0
        // sx  1
        // sy  2
        // sw  3
        // sh  4
        // dx  5
        // dy  6
        // dw  7
        // dh  8
        // z   9
        // fx  10
        // id  11 identifiant image

        let zbl = zb.length;
        if (zbl === 0) {
            return [];
        }
        let b; // Element courrant du ZBuffer;
        let lb = zb[0];
        let llb = lb;
        let lllb = lb;
        let abs = Math.abs;

        for (let i = 0; i < zbl; i++) {
            b = zb[i];
            // tant que c'est la même source de texture=
            if (b[10] === lb[10] && b[0] === lb[0] && b[1] === lb[1] && abs(b[9] - lb[9]) < 8) {
                nLast += z;
            } else if (b[10] === llb[10] && b[0] === llb[0] && b[1] === llb[1] && abs(b[9] - llb[9]) < 8) {
                nLLast += z;
            } else if (b[10] === lllb[10] && b[0] === lllb[0] && b[1] === lllb[1] && abs(b[9] - lllb[9]) < 8) {
                nLLLast += z;
            } else {
                lllb[7] = nLLLast;
                aZ.push(lllb);
                lllb = llb;
                nLLLast = nLLast;
                llb = lb;
                nLLast = nLast;
                lb = b;
                nLast = z;
            }
        }
        lllb[7] = nLLLast;
        aZ.push(lllb);
        llb[7] = nLLast;
        aZ.push(llb);
        lb[7] = nLast;
        aZ.push(lb);

        return aZ;
    }

    /**
	 * this is phase 1 of rendering.
	 * Builds an array of screen slices
     */
    computeScreenSliceBuffer(scene) {
        let xCamera = scene.camera.x;
        let yCamera = scene.camera.y;
        let fDirection = scene.camera.direction;
        const METRICS = this._options.metrics;
        const SCREEN = this._options.screen;
        let xScreenSize = SCREEN.width;
        let fViewAngle = scene.camera.fov;
        let nSpacing = METRICS.spacing;
        let fAngleLeft = fDirection - fViewAngle;       // angle value at the leftmost screen column
        let fAngleRight = fDirection + fViewAngle;      // angle value at the rightmost screen column
        let wx1 = Math.cos(fAngleLeft);             // w1 = (wx1, wy1) is a normalized position around camera for the leftmost point
        let wy1 = Math.sin(fAngleLeft);
        let wx2 = Math.cos(fAngleRight);            // w2 = (wx2, wy2) is a normalized position around camera for the rightmost point
        let wy2 = Math.sin(fAngleRight);
        let dx = (wx2 - wx1) / xScreenSize;               // dx, dy help to determine all points between w1 and w2
        let dy = (wy2 - wy1) / xScreenSize;
        let fBx = wx1;                              // starting point for the raycasting process
        let fBy = wy1;                              // (fBx, fBy) is meant to be modified by (dx, dy)
        let xCam8 = xCamera / nSpacing | 0;         // cell where the camera is.
        let yCam8 = yCamera / nSpacing | 0;
        let i;
        let zbuffer = [];
        let scanSectors = new MarkerRegistry();     // registry of cells traversed by rays
        scanSectors.mark(xCam8, yCam8);
        // background
        let bg = this._background;
        if (bg) {
            this._bgCameraOffset = 2 * fDirection * bg.width / Math.PI; // 2 * (Math.PI + fDirection) * bg.width / Math.PI;
        }

		// VR
        let xl = scene.xFrom;
        let xr = scene.xTo;

        for (i = 0; i < xScreenSize; ++i) {
            if (i >= xl && i <= xr) { // checks limits
                scene.resume.b = false;
                this.castRay(scene, xCamera, yCamera, fBx, fBy, i, scanSectors, zbuffer);
            }
            fBx += dx;
            fBy += dy;
        }

        zbuffer = Renderer._optimizeBuffer(zbuffer);
        scene.zbuffer = zbuffer;
        this.renderSprites(scene);
        // Le tri permet d'afficher les textures semi transparente après celles qui sont derrières
        zbuffer.sort(zBufferCompare);
        if (this._storey) {
            this._storey.computeScreenSliceBuffer(scene.storeyScene);
        }
	}

    /**
     * casts a ray, this may lead to the production of several screen slices (intersecting the ray),
     * which are immediatly stored into the screen slices buffer
     * @param scene {*} raycasting scene (see createScene)
     * @param x {number} ray starting position (x)
     * @param y {number} ray starting position (y)
     * @param dx {number} ray position increment along x axis
     * @param dy {number} ray position increment along y axis
     * @param xScreen {number} screen column index
     * @param visibleRegistry {MarkerRegistry} a registry for storing visible sectors
     * @param zbuffer {[]} a zbuffer for storing all created drawOps
     * @returns {*}
     */
    castRay(scene, x, y, dx, dy, xScreen, visibleRegistry, zbuffer) {
        let exclusionRegistry = new MarkerRegistry();
        let oXBlock = null; // meta data
        let oTileSet; // tileset
        let iTile; // offset of the tile (x)
        let nMaxIterations = 6; // watchdog for performance

        if (!visibleRegistry) {
            visibleRegistry = new MarkerRegistry();
        }
        do {
            this.projectRay(scene, x, y, dx, dy, exclusionRegistry, visibleRegistry);
            if (!scene.exterior && scene.distance >= 0) {
                if (xScreen !== undefined) {
                    oXBlock = this._csm.getSurface(scene.xCell, scene.yCell, scene.cellSide);
                    if (oXBlock.tileset) {
                        oTileSet = oXBlock.tileset;
                        iTile = 0;
                    } else {
                        oTileSet = this._walls;
                        iTile = this.getSurfaceTileIndex(scene.cellCode & 0xFFF, scene.cellSide);
                    }
                    zbuffer.push(this.createScreenSlice(
                        scene,
                    	xScreen,
                        oTileSet,
                        iTile,
						oXBlock.diffuse
					));
                }
                if (scene.resume.b) {
                    exclusionRegistry.mark(scene.xCell, scene.yCell);
                }
            }
            --nMaxIterations;
        } while (scene.resume.b && nMaxIterations > 0);
    }




    /**
     * compute ray projection
     * @param scene {*} raycasting scene
     * @param x {number} ray starting position
     * @param y {number} ray starting position
     * @param dx {number} ray direction (x)
     * @param dy {number} ray direction (y)
     * @param exclusionRegistry {MarkerRegistry} registers cells that are ignored by ray casting
     * @param visibleRegistry {MarkerRegistry} registers cells that are traversed by rays.
     */
    projectRay(scene, x, y, dx, dy, exclusionRegistry, visibleRegistry) {
        let side = 0;
        let map = this._map;
        let nMapSize = this.getMapSize();
        let nScale = scene.spacing;

        let
			xi,  // the cell currently traversed
			yi,  // the cell currently traversed
			xt,
			dxt,
			yt,
			dyt,
			t,
			dxi,
			dyi,
			xoff,
			yoff,
			cmax = scene.maxDistance,
			resume = scene.resume;

        if (resume.b) {
        	// the projet ray will continue from these coordinates
            xi = resume.xi;
            yi = resume.yi;
        } else {
        	// starting from the begining
            xi = x / nScale | 0;
            yi = y / nScale | 0;
        }
        xoff = (x / nScale) - xi;
        yoff = (y / nScale) - yi;
        if (dx < 0) {
            xt = -xoff / dx;
            dxt = -1 / dx;
            dxi = -1;
        } else {
            xt = (1 - xoff) / dx;
            dxt = 1 / dx;
            dxi = 1;
        }
        if (dy < 0) {
            yt = -yoff / dy;
            dyt = -1 / dy;
            dyi = -1;
        } else {
            yt = (1 - yoff) / dy;
            dyt = 1 / dy;
            dyi = 1;
        }

        let xScale = nScale * dx;
        let yScale = nScale * dy;

        t = 0;
        let done = 0;
        let c = 0;
        let bStillVisible = true;
        let nOfs, nTOfs = 0;
        let nText;
        let nPhys;
        let xint = 0, yint = 0;

        while (done === 0) {
            if (xt < yt) {
                xi += dxi;
                if (xi >= 0 && xi < nMapSize) {
                    nText = map[yi][xi];
                    nPhys = (nText >> 12) & 0xF; // **code12** phys

                    if (nText !== 0	&& exclusionRegistry.isMarked(xi, yi)) {
                        nPhys = nText = 0;
                    }

                    if (nPhys >= CONSTS.PHYS_FIRST_DOOR && nPhys <= CONSTS.PHYS_LAST_DOOR) {
                        // entre PHYS_FIRST_DOOR et PHYS_LAST_DOOR
                        nOfs = nScale >> 1;
                    } else if (nPhys === CONSTS.PHYS_SECRET_BLOCK || nPhys === CONSTS.PHYS_TRANSPARENT_BLOCK || nPhys === CONSTS.PHYS_OFFSET_BLOCK) {
                        // PHYS_SECRET ou PHYS_TRANSPARENT
                        nOfs = (nText >> 16) & 0xFF; // **Code12** offs
                    } else {
                        nOfs = 0;
                    }

                    if (nOfs) {
                        xint = x + xScale * xt;
                        yint = y + yScale * xt;
                        if (Renderer._sameOffsetWall(nOfs, xint, yint, xi, yi, dx, dy, nScale)) { // Même mur -> porte
                            nTOfs = (dxt / nScale) * nOfs;
                            yint = y + yScale * (xt + nTOfs);
                            if (((yint / nScale | 0)) !== yi) {
                                nPhys = nText = 0;
                            }
                            if (nText !== 0	&& exclusionRegistry.isMarked(xi, yi)) {
                                nPhys = nText = 0;
                            }
                        } else { // not same wall
                            nPhys = nText = 0;
                        }
                    } else {
                        nTOfs = 0;
                    }
                    // 0xB00 : INVISIBLE_BLOCK or empty 0x00
                    if (nPhys === 0xB || nPhys === 0) {
                        if (bStillVisible) {
                            visibleRegistry.mark(xi, yi);
                        }
                        xt += dxt;
                    } else {
                        t = xt + nTOfs;
                        xint = x + xScale * t;
                        yint = y + yScale * t;
                        done = 1;
                        side = 1;
                        bStillVisible = false;
                    }
                } else {
                    t = xt;
                    c = cmax;
                }
            } else {
                yi += dyi;
                if (yi >= 0 && yi < nMapSize) {
                    nText = map[yi][xi];
                    nPhys = (nText >> 12) & 0xF; // **Code12** phys

                    if (nText !== 0 && exclusionRegistry.isMarked(xi, yi)) {
                        nPhys = nText = 0;
                    }

                    if (nPhys >= CONSTS.PHYS_FIRST_DOOR && nPhys <= CONSTS.PHYS_LAST_DOOR) {
                        // entre PHYS_FIRST_DOOR et PHYS_LAST_DOOR
                        nOfs = nScale >> 1;
                    } else if (nPhys === CONSTS.PHYS_SECRET_BLOCK || nPhys === CONSTS.PHYS_TRANSPARENT_BLOCK || nPhys === CONSTS.PHYS_OFFSET_BLOCK) {
                        // PHYS_SECRET or PHYS_TRANSPARENT
                        nOfs = (nText >> 16) & 0xFF; // **Code12** offs
                    } else {
                        nOfs = 0;
                    }

                    if (nOfs) {
                        xint = x + xScale * yt;
                        yint = y + yScale * yt;
                        if (Renderer._sameOffsetWall(nOfs, xint, yint, xi, yi, dx, dy, nScale)) { // Même mur -> porte
                            nTOfs = (dyt / nScale) * nOfs;
                            xint = x + xScale * (yt + nTOfs);
                            if (((xint / nScale | 0)) !== xi) {
                                nPhys = nText = 0;
                            }
                            if (nText !== 0	&& exclusionRegistry.isMarked(xi, yi)) {
                                nPhys = nText = 0;
                            }
                        } else { // not same wall
                            nPhys = nText = 0;
                        }
                    } else {
                        nTOfs = 0;
                    }
                    if (nPhys === 0xB || nPhys === 0) {
                        if (bStillVisible) {
                            visibleRegistry.mark(xi, yi);
                        }
                        yt += dyt;
                    } else {
                        t = yt + nTOfs;
                        xint = x + xScale * t;
                        yint = y + yScale * t;
                        done = 1;
                        side = 2;
                        bStillVisible = false;
                    }
                } else {
                    t = yt;
                    c = cmax;
                }
            }
            c++;
            if (c >= cmax) {
                // t = 100;
                done = 1;
            }
        }
        if (c < cmax) {
            scene.cellCode = map[yi][xi];
            scene.wallXed = side === 1;
            scene.cellSide = side - 1;
            scene.wallColumn = scene.wallXed
                ? yint % scene.spacing | 0
                : xint % scene.spacing | 0;
            if (scene.wallXed && dxi < 0) {
                scene.wallColumn = scene.spacing - scene.wallColumn - 1;
                scene.cellSide = 2;
            }
            if (!scene.wallXed && dyi > 0) {
                scene.wallColumn = scene.spacing - scene.wallColumn - 1;
                scene.cellSide = 3;
            }
            scene.xCell = xi;
            scene.yCell = yi;
            scene.distance = t * nScale;
            scene.exterior = false;
            if (this.isWallTransparent(scene.xCell, scene.yCell)) {
                resume.b = true;
                resume.xi = xi;
                resume.yi = yi;
            } else {
                resume.b = false;
            }
        } else {
            scene.distance = t * nScale;
            scene.exterior = true;
            resume.b = false;
        }
    }

    /**
     * This function is use to determine the limit between to perpendicular wall, when one wall is offseted (alcôve)
     * This function is absolutely private and its documentation should not be taken too seriously
     * @private
     * @param nOfs {number} offset value
     * @param x0 {number} cell position x
     * @param y0 {number} cell position y
     * @param xm {number} neighbour cell position x
     * @param ym {number} neighbour cell position y
     * @param fBx {number} increment factor x
     * @param fBy {number} increment factor y
     * @param ps {number} cell size
     * @returns {boolean}
     */
    static _sameOffsetWall(nOfs, x0, y0, xm, ym, fBx, fBy, ps) {
        x0 += nOfs * fBx;
        y0 += nOfs * fBy;
        let ym2, xm2;
        ym2 = y0 / ps | 0;
        xm2 = x0 / ps | 0;
        return xm2 === xm && ym2 === ym;
    }

    /**
	 * returns true if the wall is transparent :
	 * A transparent wall is a real wall (not walkable cell), but the rays can pass through
     * A window, a barrier, could be transparent in this context
     * @param xWall {number}
     * @param yWall {number}
     * @returns {boolean}
     */
    isWallTransparent(xWall, yWall) {
        let nPhys = this.getCellPhys(xWall, yWall);
        if (nPhys === 0) {
            return false;
        }
        let nOffset = this.getCellOffset(xWall, yWall);
        // code physique transparent
        return (nPhys >= CONSTS.PHYS_FIRST_DOOR &&
            nPhys <= CONSTS.PHYS_LAST_DOOR && nOffset !== 0) ||
            nPhys === CONSTS.PHYS_TRANSPARENT_BLOCK ||
            nPhys === CONSTS.PHYS_INVISIBLE_BLOCK;
    }






/*
                                     _ _
 ___  ___ _ __ ___  ___ _ __    ___| (_) ___ ___  ___
/ __|/ __| '__/ _ \/ _ \ '_ \  / __| | |/ __/ _ \/ __|
\__ \ (__| | |  __/  __/ | | | \__ \ | | (_|  __/\__ \
|___/\___|_|  \___|\___|_| |_| |___/_|_|\___\___||___/

*/
    /**
     * create a screen slice, which is an array of parameter aimed at be rendered by a drawing method
     * @param scene {*} raycasting context
     * @param x {number} final screen column position
     * @param oTileSet {ShadedTileSet} tileset used for rendering
     * @param iTile {number} index of tile
     * @param nLight {number}
     * @return {*}
     */
    createScreenSlice(scene, x, oTileSet, iTile, nLight) {
        let z = Math.max(0.1, scene.distance);
        let nPos = scene.wallColumn;
        let bDim = scene.wallXed;
        let nPanel = scene.cellCode;

        const OPTIONS = this._options;
        const SCREEN = OPTIONS.screen;
        const SHADING = OPTIONS.shading;
        const METRICS = OPTIONS.metrics;
        let ytex = METRICS.height;
        let xtex = METRICS.spacing;
        let xscr = SCREEN.width;
        let yscr = SCREEN.width >> 1;
        let yscrPhys = SCREEN.height >> 1;
        let ff = SHADING.factor;
        let sht = SHADING.shades;
        let dmw = sht >> 1;
        let fvh = scene.camera.height;
        let dz = yscr * ytex / z | 0;

        let dzy = yscr - (dz * fvh);
        let nPhys = (nPanel >> 12) & 0xF;  // **code12** phys
        let nOffset = (nPanel >> 16) & 0xFF; // **code12** offs
        let nOpacity = z / ff | 0;
        iTile *= xtex;
        if (bDim) {
            nOpacity = (sht - dmw) * nOpacity / sht + dmw - nLight | 0;
        } else {
            nOpacity -= nLight;
        }
        nOpacity = Math.max(0, Math.min(sht - 1, nOpacity));
        let aData = [
            oTileSet.getImage(), // image 0
            iTile + nPos, // sx  1
            ytex * nOpacity, // sy  2
            1, // sw  3
            ytex, // sh  4
            x, // dx  5
            dzy - this._offsetTop - 1 | 0, // dy  6
            1, // dw  7
            (dz << 1) + 2 | 0, // dh  8
            z, // z 9
            bDim ? CONSTS.FX_DIM0 : 0
        ];

        // Traitement des portes
        switch (nPhys) {
            case CONSTS.PHYS_DOOR_UP: // porte coulissant vers le haut
                aData[2] += nOffset;
                if (nOffset > 0) {
                    aData[4] = ytex - nOffset;
                    aData[8] = ((aData[4] / (z / xscr) + 0.5)) << 1;
                }
                break;

            case CONSTS.PHYS_CURT_UP: // rideau coulissant vers le haut
                if (nOffset > 0) {
                    aData[8] = (((ytex - nOffset) / (z / xscr) + 0.5)) << 1;
                }
                break;

            case CONSTS.PHYS_CURT_DOWN: // rideau coulissant vers le bas
                aData[2] += nOffset; // no break here
            // suite au case 4...
            /** @fallthrough */

            case CONSTS.PHYS_DOOR_DOWN: // Porte coulissant vers le bas
                if (nOffset > 0) {
                    // 4: sh
                    // 6: dy
                    // 8: dh
                    // on observe que dh est un peut trop petit, ou que dy es trop haut
                    aData[4] = ytex - nOffset;
                    aData[8] = ((aData[4] / (z / xscr) + 0.5));
                    aData[6] += (dz - aData[8]) << 1;
                    aData[8] <<= 1;
                }
                break;

            case CONSTS.PHYS_DOOR_LEFT: // porte latérale vers la gauche
                if (nOffset > 0) {
                    if (nPos > (xtex - nOffset)) {
                        aData[0] = null;
                    } else {
                        aData[1] = (nPos + nOffset) % xtex + iTile;
                    }
                }
                break;

            case CONSTS.PHYS_DOOR_RIGHT: // porte latérale vers la droite
                if (nOffset > 0) {
                    if (nPos < nOffset) {
                        aData[0] = null;
                    } else {
                        aData[1] = (nPos + xtex - nOffset) % xtex + iTile;
                    }
                }
                break;

            case CONSTS.PHYS_DOOR_DOUBLE: // double porte latérale
                if (nOffset > 0) {
                    if (nPos < (xtex >> 1)) { // panneau de gauche
                        if (nPos > ((xtex >> 1) - nOffset)) {
                            aData[0] = null;
                        } else {
                            aData[1] = (nPos + nOffset) % xtex + iTile;
                        }
                    } else {
                        if (nPos < ((xtex >> 1) + nOffset)) {
                            aData[0] = null;
                        } else {
                            aData[1] = (nPos + xtex - nOffset) % xtex + iTile;
                        }
                    }
                }
                break;

            case CONSTS.PHYS_INVISIBLE_BLOCK:
                aData[0] = null;
                break;
        }
        if (OPTIONS.textures.stretch) {
            aData[6] -= aData[8];
            aData[8] <<= 1;
        }
        return aData;
    }

    /**
     */
    renderBackground() {
        // sky
        let oBG = this._background;
        if (oBG) {
            let wBG = oBG.width;
            let hBG = oBG.height;
            let xBG = (this._bgOffset + this._bgCameraOffset) % wBG | 0;
            while (xBG < 0) {
                xBG += wBG;
            }
            let yBG = (this._options.screen.height >> 1) - (hBG >> 1);
            hBG = hBG + yBG;
            const context = this._renderContext;
            context.drawImage(oBG, 0, 0, wBG, hBG, wBG - xBG, yBG, wBG, hBG);
            context.drawImage(oBG, 0, 0, wBG, hBG, -xBG, yBG, wBG, hBG);
        }
    }


    /**
     * Renders all screen slices stored in the buffer into the screen
     * @param scene {*}
     * @param context {CanvasRenderingContext2D}
     */
    static renderScreenSliceBuffer(scene, context) {
        const zbuffer = scene.zbuffer;
        for (let i = 0, l = zbuffer.length; i < l; ++i) {
            Renderer.renderScreenSlice(zbuffer[i], context);
        }
    }

    /**
     * Render flats
     * @param scene
     */
    renderFlats(scene) {
        const OPTIONS = this._options;
        const SCREEN = OPTIONS.screen;
        const METRICS = OPTIONS.metrics;
        const renderContext = this._renderContext;
        const oFlatContext = this._flatContext;
        let xStart = scene.xFrom,
            xEnd = scene.xTo,
            w = SCREEN.width,
            h = SCREEN.width >> 1,
            hPhys = SCREEN.height >> 1;
        if (!oFlatContext.imageData) {
            oFlatContext.imageData = oFlatContext
                .image
                .getContext('2d')
                .getImageData(0, 0, oFlatContext.image.width, oFlatContext.image.height);
            oFlatContext.imageData32 = new Uint32Array(oFlatContext.imageData.data.buffer);
        }
        oFlatContext.renderSurface = renderContext.getImageData(0, 0, w, hPhys << 1);
        oFlatContext.renderSurface32 = new Uint32Array(oFlatContext.renderSurface.data.buffer);
        const aFloorSurf = oFlatContext.imageData32;
        const aRenderSurf = oFlatContext.renderSurface32;
        // 1 : créer la surface
        const {direction, fov} = scene.camera;
        const wx1 = Math.cos(direction - fov);
        const wy1 = Math.sin(direction - fov);
        const wx2 = Math.cos(direction + fov);
        const wy2 = Math.sin(direction + fov);

        const ps = METRICS.spacing;
        const yTexture = METRICS.height;
        const yTexture2 = yTexture >> 1;
        const oCam = scene.camera;
        const fvh = oCam.height;

        let fh = (yTexture2) - ((fvh - 1) * yTexture2);
        let xDelta = (wx2 - wx1) / w; // incrément d'optimisateur trigonométrique
        let yDelta = (wy2 - wy1) / w; // incrément d'optimisateur trigonométrique
        let xDeltaFront;
        let yDeltaFront;
        let ff = h << 1; // focale
        let fx, fy; // coordonnée du texel finale
        let dFront; // distance "devant caméra" du pixel actuellement pointé
        let ofsDst; // offset de l'array pixel de destination (plancher)
        let wy;

        let ofsDstCeil; // offset de l'array pixel de destination (plancher)
        let wyCeil = 0;

        let xCam = oCam.x; // coord caméra x
        let yCam = oCam.y; // coord caméra y
        let nFloorWidth = oFlatContext.image.width; // taille pixel des tiles de flats
        let ofsSrc; // offset de l'array pixel source
        let xOfs = 0; // code du block flat à afficher
        let yOfs = 0; // luminosité du block flat à afficher
        let nBlock;
        let xyMax = this.getMapSize() * ps;
        let sh = OPTIONS.shading;
        let st = sh.shades - 1;
        let sf = sh.factor;
        let aMap = this._map;
        let F = this._cellCodes;
        let aFBlock;

        let fy64, fx64;
        let oXMap = this._csm;
        let oXBlock, oXBlockImage, oXBlockCeil;
        let fBx, fBy;
        const offsetTop = this._offsetTop;
        const offsetTopPix = offsetTop * w;

        if (fvh === 1) {
            let nXDrawn = 0; // 0: pas de texture perso ; 1 = texture perso sol; 2=texture perso plafond
            for (let y = 1, hMax = h - offsetTop; y < hMax; ++y) {

                fBx = wx1;
                fBy = wy1;

                // floor
                dFront = fh * ff / y;
                fy = wy1 * dFront + yCam;
                fx = wx1 * dFront + xCam;
                xDeltaFront = xDelta * dFront;
                yDeltaFront = yDelta * dFront;
                wy = w * (h + y) - offsetTopPix;
                wyCeil = w * (h - y - 1) - offsetTopPix;
                yOfs = Math.min(st, dFront / sf | 0);

                for (let x = 0; x < w; ++x) {
                    ofsDst = wy + x;
                    ofsDstCeil = wyCeil + x;
                    fy64 = fy / ps | 0; // sector
                    fx64 = fx / ps | 0;
                    if (x >= xStart && x <= xEnd && fx >= 0 && fy >= 0 && fx < xyMax && fy < xyMax) {
                        nXDrawn = 0;
                        oXBlock = oXMap.getSurface(fx64, fy64, 4);
                        oXBlockCeil = oXMap.getSurface(fx64, fy64, 5);
                        if (oXBlock.imageData32) {
                            oXBlockImage = oXBlock.imageData32;
                            ofsSrc = (((fy  % ps) + yOfs * ps | 0) * ps + (((fx % ps) | 0)));
                            aRenderSurf[ofsDst] = oXBlockImage[ofsSrc];
                            nXDrawn += 1;
                        }
                        if (oXBlockCeil.imageData32) {
                            oXBlockImage = oXBlockCeil.imageData32;
                            if (nXDrawn === 0) {
                                ofsSrc = (((fy  % ps) + yOfs * ps | 0) * ps + (((fx % ps) | 0)));
                            }
                            aRenderSurf[ofsDstCeil] = oXBlockImage[ofsSrc];
                            nXDrawn += 2;
                        }
                        if (nXDrawn !== 3) {
                            nBlock = aMap[fy / ps | 0][fx / ps | 0] & 0xFFF; // **code12** code
                            aFBlock = F[nBlock];
                            if (aFBlock !== null) {
                                if (nXDrawn !== 1) {
                                    xOfs = aFBlock[4];
                                    if (xOfs !== null) {
                                        ofsSrc = (((fy % ps) + yOfs * ps | 0) * nFloorWidth + (((fx % ps) + xOfs * ps | 0)));
                                        aRenderSurf[ofsDst] = aFloorSurf[ofsSrc];
                                    }
                                }
                                if (nXDrawn !== 2) {
                                    xOfs = aFBlock[5];
                                    if (xOfs !== null) {
                                        ofsSrc = (((fy % ps) + yOfs * ps | 0) * nFloorWidth + (((fx % ps) + xOfs * ps | 0)));
                                        aRenderSurf[ofsDstCeil] = aFloorSurf[ofsSrc];
                                    }
                                }
                            }
                        }
                    }
                    fy += yDeltaFront;
                    fx += xDeltaFront;
                }
            }
        } else {
            let yOfsCeil;

            let fhCeil = yTexture2 + ((fvh - 1) * yTexture2);
            let xDeltaFrontCeil = 0;
            let yDeltaFrontCeil = 0;
            let fxCeil = 0, fyCeil = 0; // coordonnée du texel finale
            let dFrontCeil; // distance "devant caméra" du pixel actuellement pointé

            for (let y = 1, hMax = h - offsetTop; y < hMax; ++y) {
                fBx = wx1;
                fBy = wy1;

                // floor
                dFront = fh * ff / y;
                fy = wy1 * dFront + yCam;
                fx = wx1 * dFront + xCam;
                xDeltaFront = xDelta * dFront;
                yDeltaFront = yDelta * dFront;
                wy = w * (h + y - 1) - offsetTopPix;
                yOfs = Math.min(st, dFront / sf | 0);

                // ceill
                dFrontCeil = fhCeil * ff / y;
                fyCeil = wy1 * dFrontCeil + yCam;
                fxCeil = wx1 * dFrontCeil + xCam;
                xDeltaFrontCeil = xDelta * dFrontCeil;
                yDeltaFrontCeil = yDelta * dFrontCeil;
                wyCeil = w * (h - y) - offsetTopPix;
                yOfsCeil = Math.min(st, dFrontCeil / sf | 0);
                for (let x = 0; x < w; ++x) {
                    ofsDst = wy + x;
                    ofsDstCeil = wyCeil + x;
                    fy64 = fy / ps | 0;
                    fx64 = fx / ps | 0;
                    if (x >= xStart && x <= xEnd && fx >= 0 && fy >= 0 && fx < xyMax && fy < xyMax) {
                        oXBlock = oXMap.getSurface(fx64, fy64, 4);
                        if (oXBlock.imageData32) {
                            oXBlockImage = oXBlock.imageData32;
                            ofsSrc = (((fy  % ps) + yOfs * ps | 0) * ps + (((fx % ps) | 0)));
                            aRenderSurf[ofsDst] = oXBlockImage[ofsSrc];
                        } else {
                            nBlock = aMap[fy64][fx64] & 0xFFF; // **code12** code
                            aFBlock = F[nBlock];
                            if (aFBlock !== null) {
                                xOfs = aFBlock[4];
                                if (xOfs !== null) {
                                    ofsSrc = (((fy % ps) + yOfs * ps | 0) * nFloorWidth + (((fx % ps) + xOfs * ps | 0)));
                                    aRenderSurf[ofsDst] = aFloorSurf[ofsSrc];
                                }
                            }
                        }
                    }
                    if (x >= xStart && x <= xEnd && fxCeil >= 0 && fyCeil >= 0 && fxCeil < xyMax && fyCeil < xyMax) {
                        fy64 = fyCeil / ps | 0;
                        fx64 = fxCeil / ps | 0;
                        oXBlockCeil = oXMap.getSurface(fx64, fy64, 5);
                        if (oXBlockCeil.imageData32) {
                            oXBlockImage = oXBlockCeil.imageData32;
                            ofsSrc = (((fyCeil  % ps) + yOfsCeil * ps | 0) * ps + (((fxCeil % ps) | 0)));
                            aRenderSurf[ofsDstCeil] = oXBlockImage[ofsSrc];
                        } else {
                            nBlock = aMap[fy64][fx64] & 0xFFF; // **code12** code
                            aFBlock = F[nBlock];
                            if (aFBlock !== null) {
                                xOfs = aFBlock[5];
                                if (xOfs !== null) {
                                    ofsSrc = (((fyCeil % ps) + yOfsCeil * ps | 0) * nFloorWidth + (((fxCeil % ps) + xOfs * ps | 0)));
                                    aRenderSurf[ofsDstCeil] = aFloorSurf[ofsSrc];
                                }
                            }
                        }
                    }
                    fyCeil += yDeltaFrontCeil;
                    fxCeil += xDeltaFrontCeil;
                    fy += yDeltaFront;
                    fx += xDeltaFront;
                }
            }
        }
        renderContext.putImageData(oFlatContext.renderSurface, 0, 0);
    }

    /**
     * Renders the portion of texture described in the zbi parameter
     * @param zbi {array} array of parameters mapped into the contex2d.renderScreenSlice function
     * @param rc {CanvasRenderingContext2D} context where the line is rendered
     */
    static renderScreenSlice(zbi, rc) {
        let aLine = zbi;
        let sGCO = '';
        let fGobalAlphaSave = 0;
        let nFx = aLine[10];
        if (nFx & 1) {
            sGCO = rc.globalCompositeOperation;
            rc.globalCompositeOperation = 'lighter';
        }
        const flagSourceFactor = 1 - ((nFx & 2) >> 1);
        if (nFx & 12) {
            fGobalAlphaSave = rc.globalAlpha;
            rc.globalAlpha = CONSTS.FX_ALPHA[nFx >> 2];
        }
        let xStart = aLine[1];
        if (xStart >= 0) {
            try {
                rc.drawImage(
                    aLine[0],
                    aLine[1] | 0,       // sx
                    aLine[2] * flagSourceFactor | 0,       // sy
                    aLine[3] | 0,       // sw
                    aLine[4] | 0,       // sh
                    aLine[5] | 0,       // dx
                    aLine[6] | 0,       // dy
                    aLine[7] | 0,       // dw
                    aLine[8] | 0);      // dh
            } catch (e) {}
        }
        if (sGCO !== '') {
            rc.globalCompositeOperation = sGCO;
        }
        if (nFx & 12) {
            rc.globalAlpha = fGobalAlphaSave;
        }
    }


    /**
     * Will precompute anything necessary for the rendering phase
     */
    computeScene(x, y, angle, height) {
        if (this.optionsHaveMutated()) { // sync
            this.optionsReaction();     // async
        }
        const scene = this.createScene(x, y, angle, height);
        this.computeScreenSliceBuffer(scene);
        return scene;
    }

    /**
     * This will render the raycasting scene in the specified 2d context
     * @param scene
     */
    render(scene) {
        const renderContext = this._renderContext;
        const VR = scene.vr;
        if (VR) {
            renderContext.save();
            renderContext.beginPath();
            renderContext.rect(scene.xFrom, 0, scene.xTo - scene.xFrom + 1, this._options.screen.height);
            renderContext.clip();
        }
        this.renderBackground(renderContext);
        if (scene.storeyScene) {
            Renderer.renderScreenSliceBuffer(scene.storeyScene, renderContext);
        }
        this.renderFlats(scene, renderContext);
        Renderer.renderScreenSliceBuffer(scene, renderContext);
        this.renderDebug(renderContext);
        if (VR) {
            renderContext.restore();
        }
    }

    flip(finalContext) {
        finalContext.drawImage(this._renderCanvas, 0, 0);
    }







//                 _ _                            _           _
//  ___ _ __  _ __(_) |_ ___   _ __ ___ _ __   __| | ___ _ __(_)_ __   __ _
// / __| '_ \| '__| | __/ _ \ | '__/ _ \ '_ \ / _` |/ _ \ '__| | '_ \ / _` |
// \__ \ |_) | |  | | ||  __/ | | |  __/ | | | (_| |  __/ |  | | | | | (_| |
// |___/ .__/|_|  |_|\__\___| |_|  \___|_| |_|\__,_|\___|_|  |_|_| |_|\__, |
//     |_|                                                            |___/


    /**
     * Creates a new sprite and associated it with a tileset
     * @param oTileSet {ShadedTileSet} tileset
     * @return {Sprite}
     */
    buildSprite(oTileSet) {
        const oSprite = new Sprite();
        oSprite.setTileSet(oTileSet);
        this._sprites.push(oSprite);
        return oSprite;
    }

    /**
     * shades a tileset with new parameters, to match those used in the raycasting rendering
     * @param tileset {ShadedTileSet}
     * @param nShades {number} number of shading layers
     * @param sFogColor {string} new fog color
     * @param sFilter {string} new color filter
     * @param fBrightness {number} new ambiant brightness
     */
    shadeTileSet(tileset, nShades, sFogColor, sFilter, fBrightness) {
        tileset.setShadingLayerCount(nShades);
        tileset.compute(sFogColor, sFilter, fBrightness);
    }

    /**
     * update sprite shading with new parameters, to match those used in the raycasting rendering
     * @param nShades {number} number of shading layers
     * @param sFogColor {string} new fog color
     * @param sFilter {string} new color filter
     * @param fBrightness {number} new ambiant brightness
     */
    shadeTileSets(nShades, sFogColor, sFilter, fBrightness) {
        const sts = this._tilesets;
        for (let i = 0, l = sts.length; i < l; ++i) {
            this.shadeTileSet(sts[i], nShades, sFogColor, sFilter, fBrightness);
        }
    }


    /**
     * Remove all tilesets that are not currently used by sprites.
     * this operation is not really optimized, and should not be called frequently
     */
    removeUnusedTileSets() {
        const ts = this._tilesets;
        this._tilesets = this
            ._sprites
            .filter(s => ts.indexOf(s.getTileSet()) >= 0)
            .map(s => s.getTileSet());
    }

    /**
     * Remove a sprite from the sprite collection
     * @param oSprite {Sprite}
     */
    disposeSprite(oSprite) {
        const sprites = this._sprites;
        const i = sprites.indexOf(oSprite);
        sprites.splice(i, 1);
    }


    renderSprites(scene) {
        const sprites = this._sprites;
        for (let i = 0, l = sprites.length; i < l; ++i) {
            this.renderSprite(scene, sprites[i]);
        }
    }

    renderSprite(scene, oSprite) {
        if (!oSprite.visible) {
            return;
        }
        const PI = Math.PI;
        const OPTIONS = this._options;
        const CAMERA = scene.camera;
        const SCREEN = OPTIONS.screen;
        const xspr = oSprite.x;
        const yspr = oSprite.y;
        const xcam = CAMERA.x;
        const ycam = CAMERA.y;
        const dx = xspr - xcam;
        const dy = yspr - ycam;
        const ts = oSprite.getTileSet();
        const fov = CAMERA.fov;

        const fTarget = Math.atan2(dy, dx);
        let fAlpha = fTarget - CAMERA.direction; // Angle
        if (fAlpha >= PI) { // Angle greater than plane angle
            fAlpha = -(PI * 2 - fAlpha);
        }
        if (fAlpha < -PI) { // Angle lesser than plane angle
            fAlpha = PI * 2 + fAlpha;
        }

        if (Math.abs(fAlpha) <= (fov * 1.5)) {
            const wspr = ts.tileWidth;        // sprite width
            const hspr = ts.tileHeight;       // sprite height
            const xscr = SCREEN.width;              // screen width
            const yscr = SCREEN.width;
            const xscr2 = xscr >> 1;                // screen half width
            const yscr2 = yscr >> 1;                // screen half height
            const z = GeometryHelper.distance(xspr, yspr, xcam, ycam);     // distance between camera and sprite
            const x = Math.sin(fAlpha) * z;         // sprite x position
            const f = Math.cos(fAlpha) * z;         // projected distance on camera direction axis
            const focal = SCREEN.focal;
            const factor = focal / f;               // projection factor
            const xp = x * factor;                  // projection of x
            const dw = wspr * factor;               // projection of width
            const dx = xscr2 + xp - (dw >> 1);      // projection of destination x

            const dh = hspr * factor;
            const dh_h = (OPTIONS.metrics.height >> 1) * (1 - CAMERA.height) * factor;
            const hAltitud = oSprite.h * factor;
            const dy = yscr2 + dh_h - hAltitud - (dh >> 1) - this._offsetTop;

            const sh = OPTIONS.shading.shades;
            const nShade = Math.max(0, Math.min(sh - 1, z / OPTIONS.shading.factor | 0));

            const data = [
                ts.getImage(),
                wspr * oSprite.getCurrentFrame(),               // 1: sx
                nShade * hspr,                                  // 2: sy
                wspr,                                           // 3: sw
                hspr,                                           // 4: sh
                dx | 0,                                         // 5: dx
                dy | 0,                                         // 6: dy
                dw | 0,                                         // 7: dw
                dh | 0,                                         // 8: dh
                z,                                              // 9: z indication
                oSprite.flags                                   // flags
            ];
            scene.zbuffer.push(data);
        }
    }

    renderDebug(context) {
        this._debugDisplay.display(context, 0, this._offsetTop);
    }




//                  __                              _       _   _
//  ___ _   _ _ __ / _| __ _  ___ ___   _ __   __ _(_)_ __ | |_(_)_ __   __ _
// / __| | | | '__| |_ / _` |/ __/ _ \ | '_ \ / _` | | '_ \| __| | '_ \ / _` |
// \__ \ |_| | |  |  _| (_| | (_|  __/ | |_) | (_| | | | | | |_| | | | | (_| |
// |___/\__,_|_|  |_|  \__,_|\___\___| | .__/ \__,_|_|_| |_|\__|_|_| |_|\__, |
//                                     |_|                              |___/

    /**
     * Clonage de mur.
     * La texture nSide du pan mur spécifié par x, y est copiée dans un canvas transmis
     * à une function callBack. à charge de cette fonction de dessiner ce qu'elle veux dans
     * ce canvas cloné. cette modification sera reportée dans le jeu.
     *
     * @param x coordonnée X du mur
     * @param y coordonnée Y du mur
     * @param nSide coté du mur 0:nord, 1:est, 2:sud, 3:ouest
     * @param pDrawingFunction fonction qui servira à déssiner le mur (peut être un tableau [instance, function],
     * cette fonction devra accepter les paramètres suivants :
     * - param1 : instance du raycaster
     * - param2 : instance du canvas qui contient le clone de la texture.
     * - param3 : coordoonée X du mur
     * - param4 : coordoonée Y du mur
     * - param5 : coté du mur concerné
     */
    paintSurface(x, y, nSide, pDrawingFunction) {
        const cellCode = this.getCellMaterial(x, y);
        const iTile = this._cellCodes[cellCode][nSide];
        const c = nSide < 4
            ? this._walls.extractTile(iTile, 0)
            : this._flats.extractTile(iTile, 0);
        const csm = this._csm;
        CanvasHelper.setImageSmoothing(c, true);
        pDrawingFunction(x, y, nSide, c);
        CanvasHelper.setImageSmoothing(c, this._options.textures.smooth);
        csm.setSurfaceTile(x, y, nSide, c);
        this.shadeSurface(x, y, nSide);
    }

    shadeSurface(x, y, nSide) {
        const opt = this._options;
        const SHADING = opt.shading;
        this._csm.shadeSurface(x, y, nSide, SHADING.shades, SHADING.color, SHADING.filter, SHADING.brightness);
    }









//  _            _                                _                 _   _
// | |_ _____  _| |_ _   _ _ __ ___    __ _ _ __ (_)_ __ ___   __ _| |_(_) ___  _ __
// | __/ _ \ \/ / __| | | | '__/ _ \  / _` | '_ \| | '_ ` _ \ / _` | __| |/ _ \| '_ \
// | ||  __/>  <| |_| |_| | | |  __/ | (_| | | | | | | | | | | (_| | |_| | (_) | | | |
//  \__\___/_/\_\\__|\__,_|_|  \___|  \__,_|_| |_|_|_| |_| |_|\__,_|\__|_|\___/|_| |_|


    /**
     * Adds a tile animation
     * @param oAnimation {TileAnimation}
     * @returns {*}
     */
    linkAnimation(oAnimation) {
        this._animations.push(oAnimation);
        return oAnimation;
    }

    /**
     * creates a new tile animation with the given base parameters
     * @param base
     * @param count
     * @param duration
     * @param loop
     * @returns {*}
     */
    createAnimation(base, count, duration, loop = 1) {
        const oAnimation = new TileAnimation();
        oAnimation.base = base;
        oAnimation.count = count;
        oAnimation.duration = duration;
        oAnimation.loop = loop;
        return this.linkAnimation(oAnimation);
    }

    /**
     * computes all tile animations
     * @param nTimeInc
     */
    computeAnimations(nTimeInc) {
        const anims = this._animations;
        for (let i = 0, l = anims.length; i < l; ++i) {
            anims[i].animate(nTimeInc);
        }
        const sprites = this._sprites;
        for (let i = 0, l = sprites.length; i < l; ++i) {
            sprites[i].animation.animate(nTimeInc);
        }
    }
}

export default Renderer;
