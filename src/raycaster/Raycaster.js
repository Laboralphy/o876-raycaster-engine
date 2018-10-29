import ShadedTileSet from './ShadedTileSet';
import MarkerRegistry from './MarkerRegistry';
import CellSurfaceManager from './CellSurfaceManager';
import CanvasHelper from './CanvasHelper';
import * as CONSTS from './consts';

/**
 * @todo sprite rendering
 * @todo texture cloning and customization
 * @todo upper level
 * @todo texture animation
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




class Raycaster {
	
	constructor() {
		this._world = {
            metrics: {
                height: 96,	         // wallXed height of walls
                spacing: 64,         // size of a cell, on the floor
            },
            screen: {               // the virtual screen where the world is rendered
                height: 250,	    // vertical screen size (in pixels)
                width: 400,         // horizontal screen size (in pixels)
                aspect: 4/3,
                fov: Math.PI / 4    // You should not change this setting but only slightly
            },
            visual: {		        // all things visual
                smooth: false,      // set texture smoothing on or off
                fog: {			    // fog setting (at long distance)
                color: 'black',	        // fog color
                    distance: 100,    // distance where the fog at full intensity
                },
                filter: false,		    // color filter for sprites (ambient color)
                brightness: 0,	    // base brightness
                shading: {
                    factor: 50,			// distance where the texture shading increase by one unit
                    threshold: 16,    	// number of shading layers
                    dim: 7,				// shading factor added to the y axis wall only, to simulate realistic lighting
                }
            },
            doubleHeight: false         // second storey is double height (for city buildings)
        };

		this._map = [];
        this._walls = null; // wall shaded tileset
        this._flats = null; // flat shaded tileset
        this._background = null; // background image
		this._csm = new CellSurfaceManager();
        this._cellCodes = []; // this is an array of array of sides

        this._zbuffer = null; // array of drawing operation
        this._bgOffset = 0; // oofset between camera and background position
        this._bgCameraOffset = 0; // oofset between camera and background position

        this._flatContext = {
            image: null,
            imageData: null,
            imageData32: null,
            renderSurface: null,
            renderSurface32: null
        };

        this._vrContext = {
            b: false,
            leftColumn: 0,
            rightColumn: 0
        };

	}

    defineWorld(w) {

    }

/*
                    _     _       _       __ _       _ _   _
__      _____  _ __| | __| |   __| | ___ / _(_)_ __ (_) |_(_) ___  _ __
\ \ /\ / / _ \| '__| |/ _` |  / _` |/ _ \ |_| | '_ \| | __| |/ _ \| '_ \
 \ V  V / (_) | |  | | (_| | | (_| |  __/  _| | | | | | |_| | (_) | | | |
  \_/\_/ \___/|_|  |_|\__,_|  \__,_|\___|_| |_|_| |_|_|\__|_|\___/|_| |_|

*/


	/**
	 * Defines the wall textures.
	 * @param oImage {HTMLCanvasElement|HTMLImageElement} this image contains all wall textures and must be fully charged
	 */
    setWallTextures(oImage) {
        let width = this._world.metrics.spacing;
        let height = this._world.metrics.height;
        CanvasHelper.setDefaultImageSmoothing(this._world.visual.smooth);
        this._walls = Raycaster.buildTileSet(
            oImage,
            width,
            height,
            this._world.visual.shading.threshold
        );
    }

    /**
     * Defines the flat textures.
     * @param oImage {HTMLCanvasElement|HTMLImageElement} this image contains all flat textures and must be fully charged
     */
    setFlatTextures(oImage) {
        let width = this._world.metrics.spacing;
        CanvasHelper.setDefaultImageSmoothing(this._world.visual.smooth);
        this._flats = Raycaster.buildTileSet(
            oImage,
            width,
            width,
            this._world.visual.shading.threshold
        );
    }

    /**
     * Background is an image painted under the screen slices
     * @param oImage
     */
    setBackground(oImage) {
        this._background = oImage;
    }

    /**
	 * builds a tileset of texture, out of an image, and shades it
     * @param oImage {Image|HTMLCanvasElement}
     * @param width {number}
     * @param height {number}
     * @param nShadingThreshold {number}
     */
    static buildTileSet(oImage, width, height, nShadingThreshold) {
        const sw = new ShadedTileSet();
        sw.setShadingLayerCount(nShadingThreshold);
        sw.setImage(oImage, width, height);
        return sw;
    }


    /**
	 * Defines the visual settings
     * @param sFogColor {string} color of the fog
     * @param sFilter {string} color of the ambient lighting
     * @param nBrightness {number} base texture light diffusion, if 0, then wall are not emitting light
     */
	setVisualSettings(sFogColor, sFilter, nBrightness) {
        this._walls.compute(sFogColor, sFilter, nBrightness);
        this._flats.compute(sFogColor, sFilter, nBrightness);
        this._flatContext.image = this._flats.getImage();
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
    registerCellCode(nCode, {n, e, s, w, f, c}) {
        this._cellCodes[nCode] = [n, e, s, w, f, c];
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
    setCellCode(x, y, code) {
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
	getCellCode(x, y) {
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
     * Creates a raycasting context
     * @return {*}
     */
    createContext(xCamera, yCamera, fDirection, renderContext) {
        return {         // raycasting context
            renderContext,
            camera: {
                x: xCamera,             // camera position
                y: yCamera,             // ...
                fov: this._world.screen.fov,    // camera view fov
                direction: fDirection,              // camera direction angle
                height: 1               // camera view height
            },
            resume: {           // resume context
                b: false,       // next castRay must resume !
                xi: 0,          // cell position of resuming
                yi: 0           // ...
            },
            exterior: false,    // the last ray hit an exterior line
            distance: 0,        // the last computed distance (length of the last computed ray)
            maxDistance: 100,   // maximum length of a ray. if a distance is greater than this value, the ray is not rendered
            spacing: this._world.metrics.spacing,   // cell size
            cellCode: 0,        // code of the last hit cell
            xCell: 0,           // position of the last hit cell
            yCell: 0,           // ...
            wallSide: 0,        // side number of the wall of the last hitCell
            wallXed: false,     // if true then the hit cell wall is X-axed
            wallColumn: 0,      // index of the column of the last hit wall
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
    computeScreenSliceBuffer(ctx) {
        let xCamera = ctx.camera.x;
        let yCamera = ctx.camera.y;
        let fDirection = ctx.camera.direction;
        const METRICS = this._world.metrics;
        const SCREEN = this._world.screen;
        let xScreenSize = SCREEN.width;
        let fViewAngle = ctx.camera.fov;
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
        const vr = this._vrContext;
        let xl = vr.b ? vr.leftColumn : 0;
        let xr = vr.b ? vr.rightColumn : xScreenSize;

        for (i = 0; i < xScreenSize; ++i) {
            if (i >= xl && i <= xr) { // checks limits
                ctx.resume.b = false;
                this.castRay(ctx, xCamera, yCamera, fBx, fBy, i, scanSectors, zbuffer);
            }
            fBx += dx;
            fBy += dy;
        }

        zbuffer = Raycaster._optimizeBuffer(zbuffer);
        //this.drawHorde(aZBuffer);
        // Le tri permet d'afficher les textures semi transparente après celles qui sont derrières
        zbuffer.sort(zBufferCompare);
        this._zbuffer = zbuffer;
        return zbuffer;
	}

    /**
     * casts a ray, this may lead to the production of several screen slices (intersecting the ray),
     * which are immediatly stored into the screen slices buffer
     * @param ctx {*} raycasting context (see createContext)
     * @param x {number} ray starting position (x)
     * @param y {number} ray starting position (y)
     * @param dx {number} ray position increment along x axis
     * @param dy {number} ray position increment along y axis
     * @param xScreen {number} screen column index
     * @param visibleRegistry {MarkerRegistry} a registry for storing visible sectors
     * @param zbuffer {[]} a zbuffer for storing all created drawOps
     * @returns {*}
     */
    castRay(ctx, x, y, dx, dy, xScreen, visibleRegistry, zbuffer) {
        let exclusionRegistry = new MarkerRegistry();
        let oXBlock = null; // meta data
        let oTileSet; // tileset
        let iTile; // offset of the tile (x)
        let nMaxIterations = 6; // watchdog for performance

        if (!visibleRegistry) {
            visibleRegistry = new MarkerRegistry();
        }
        do {
            this.projectRay(ctx, x, y, dx, dy, exclusionRegistry, visibleRegistry);
            if (!ctx.exterior && ctx.distance >= 0) {
                if (xScreen !== undefined) {
                    oXBlock = this._csm.getSurface(ctx.xCell, ctx.yCell, ctx.cellSide);
                    if (oXBlock.tileset) {
                        oTileSet = oXBlock.tileset;
                        iTile = 0;
                    } else {
                        oTileSet = this._walls;
                        iTile = this._cellCodes[ctx.cellCode & 0xFFF][ctx.cellSide];
                    }
                    zbuffer.push(this.createScreenSlice(
                        ctx,
                    	xScreen,
                        oTileSet,
                        iTile,
						oXBlock.diffuse
					));
                }
                if (ctx.resume.b) {
                    exclusionRegistry.mark(ctx.xCell, ctx.yCell);
                }
            }
            --nMaxIterations;
        } while (ctx.resume.b && nMaxIterations > 0);
    }




    /**
     * compute ray projection
     * @param ctx {*} raycasting context
     * @param x {number} ray starting position
     * @param y {number} ray starting position
     * @param dx {number} ray direction (x)
     * @param dy {number} ray direction (y)
     * @param exclusionRegistry {MarkerRegistry} registers cells that are ignored by ray casting
     * @param visibleRegistry {MarkerRegistry} registers cells that are traversed by rays.
     */
    projectRay(ctx, x, y, dx, dy, exclusionRegistry, visibleRegistry) {
        let side = 0;
        let map = this._map;
        let nMapSize = this.getMapSize();
        let nScale = ctx.spacing;

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
			cmax = ctx.maxDistance,
			resume = ctx.resume;

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
                        if (Raycaster._sameOffsetWall(nOfs, xint, yint, xi, yi, dx, dy, nScale)) { // Même mur -> porte
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
                        if (Raycaster._sameOffsetWall(nOfs, xint, yint, xi, yi, dx, dy, nScale)) { // Même mur -> porte
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
            ctx.cellCode = map[yi][xi];
            ctx.wallXed = side === 1;
            ctx.cellSide = side - 1;
            ctx.wallColumn = ctx.wallXed
                ? yint % ctx.spacing | 0
                : xint % ctx.spacing | 0;
            if (ctx.wallXed && dxi < 0) {
                ctx.wallColumn = ctx.spacing - ctx.wallColumn - 1;
                ctx.cellSide = 2;
            }
            if (!ctx.wallXed && dyi > 0) {
                ctx.wallColumn = ctx.spacing - ctx.wallColumn - 1;
                ctx.cellSide = 3;
            }
            ctx.xCell = xi;
            ctx.yCell = yi;
            ctx.distance = t * nScale;
            ctx.exterior = false;
            if (this.isWallTransparent(ctx.xCell, ctx.yCell)) {
                resume.b = true;
                resume.xi = xi;
                resume.yi = yi;
            } else {
                resume.b = false;
            }
        } else {
            ctx.distance = t * nScale;
            ctx.exterior = true;
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
     * @param ctx {*} raycasting context
     * @param x {number} final screen column position
     * @param oTileSet {ShadedTileSet} tileset used for rendering
     * @param iTile {number} index of tile
     * @param nLight {number}
     * @return {*}
     */
    createScreenSlice(ctx, x, oTileSet, iTile, nLight) {
        let z = Math.max(0.1, ctx.distance);
        let nPos = ctx.wallColumn;
        let bDim = ctx.wallXed;
        let nPanel = ctx.cellCode;

        const WORLD = this._world;
        const SCREEN = WORLD.screen;
        const SHADING = WORLD.visual.shading;
        const METRICS = WORLD.metrics;
        let aspect = SCREEN.aspect;
        let ytex = METRICS.height;
        let xtex = METRICS.spacing;
        let xscr = SCREEN.width;
        let yscr = SCREEN.height >> 1;
        let vyscr = 0.5 * xscr / aspect;
        let shf = SHADING.factor;
        let sht = SHADING.threshold - 1;
        let dmw = SHADING.dim;
        let fvh = ctx.camera.height;
        let dz = (ytex * vyscr / z) + 0.5 | 0;
        let dzy = yscr - (dz * fvh);
        let nPhys = (nPanel >> 12) & 0xF;  // **code12** phys
        let nOffset = (nPanel >> 16) & 0xFF; // **code12** offs
        let nOpacity = z / shf | 0;
        iTile *= xtex;
        if (bDim) {
            nOpacity = (sht - dmw) * nOpacity / sht + dmw - nLight | 0;
        } else {
            nOpacity -= nLight;
        }
        nOpacity = Math.max(0, Math.min(sht, nOpacity));
        let aData = [
            oTileSet.getImage(), // image 0
            iTile + nPos, // sx  1
            ytex * nOpacity, // sy  2
            1, // sw  3
            ytex, // sh  4
            x, // dx  5
            dzy - 1, // dy  6
            1, // dw  7
            (2 + dz * 2), // dh  8
            z, // z 9
            bDim ? CONSTS.FX_DIM0 : 0
        ];

        // Traitement des portes
        switch (nPhys) {
            case CONSTS.PHYS_DOOR_SLIDING_UP: // porte coulissant vers le haut
                aData[2] += nOffset;
                if (nOffset > 0) {
                    aData[4] = ytex - nOffset;
                    aData[8] = ((aData[4] / (z / vyscr) + 0.5)) << 1;
                }
                break;

            case CONSTS.PHYS_CURT_SLIDING_UP: // rideau coulissant vers le haut
                if (nOffset > 0) {
                    aData[8] = (((ytex - nOffset) / (z / vyscr) + 0.5)) << 1;
                }
                break;

            case CONSTS.PHYS_CURT_SLIDING_DOWN: // rideau coulissant vers le bas
                aData[2] += nOffset; // no break here
            // suite au case 4...
            /** @fallthrough */

            case CONSTS.PHYS_DOOR_SLIDING_DOWN: // Porte coulissant vers le bas
                if (nOffset > 0) {
                    // 4: sh
                    // 6: dy
                    // 8: dh
                    // on observe que dh est un peut trop petit, ou que dy es trop haut
                    aData[4] = ytex - nOffset;
                    aData[8] = ((aData[4] / (z / vyscr) + 0.5));
                    aData[6] += (dz - aData[8]) << 1;
                    aData[8] <<= 1;
                }
                break;

            case CONSTS.PHYS_DOOR_SLIDING_LEFT: // porte latérale vers la gauche
                if (nOffset > 0) {
                    if (nPos > (xtex - nOffset)) {
                        aData[0] = null;
                    } else {
                        aData[1] = (nPos + nOffset) % xtex + iTile;
                    }
                }
                break;

            case CONSTS.PHYS_DOOR_SLIDING_RIGHT: // porte latérale vers la droite
                if (nOffset > 0) {
                    if (nPos < nOffset) {
                        aData[0] = null;
                    } else {
                        aData[1] = (nPos + xtex - nOffset) % xtex + iTile;
                    }
                }
                break;

            case CONSTS.PHYS_DOOR_SLIDING_DOUBLE: // double porte latérale
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
        if (WORLD.doubleHeight) {
            aData[6] -= aData[8];
            aData[8] <<= 1;
        }
        return aData;
    }

    renderBackground(context) {
        // sky
        let oBG = this._background;
        if (oBG) {
            let wBG = oBG.width;
            let hBG = oBG.height;
            let xBG = (this._bgOffset + this._bgCameraOffset) % wBG | 0;
            while (xBG < 0) {
                xBG += wBG;
            }
            let yBG = (this._world.screen.height >> 1) - (hBG >> 1);
            hBG = hBG + yBG;
            context.drawImage(oBG, 0, 0, wBG, hBG, wBG - xBG, yBG, wBG, hBG);
            context.drawImage(oBG, 0, 0, wBG, hBG, -xBG, yBG, wBG, hBG);
        }
    }


    /**
     * Renders all screen slices stored in the buffer into the screen
     * @param zbuffer {array}
     * @param context {CanvasRenderingContext2D}
     */
    static renderScreenSliceBuffer(zbuffer, context) {
        for (let i = 0, l = zbuffer.length; i < l; ++i) {
            Raycaster.renderScreenSlice(zbuffer[i], context);
        }
    }

    render(ctx) {
        const context = ctx.renderContext;
        this.renderBackground(context);
        this.renderFlats(ctx);
        Raycaster.renderScreenSliceBuffer(this._zbuffer, context);
    }

    /**
     * Render flats
     * @param ctx
     */
    renderFlats(ctx) {
        if (ctx.camera.height !== 1) {
            this.renderFlatsVHX(ctx);
        } else {
            this.renderFlatsVH1(ctx);
        }
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
        if (nFx & 12) {
            fGobalAlphaSave = rc.globalAlpha;
            rc.globalAlpha = CONSTS.FX_ALPHA[nFx >> 2];
        }
        let xStart = aLine[1];
        if (xStart >= 0) {
            try {
                rc.drawImage(
                    aLine[0],
                    aLine[1] | 0,
                    aLine[2] | 0,
                    aLine[3] | 0,
                    aLine[4] | 0,
                    aLine[5] | 0,
                    aLine[6] | 0,
                    aLine[7] | 0,
                    aLine[8] | 0);
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
     * Rendu du floor et du ceil quand fViewHeight est à 1
     */

    /**
     * Rendu du floor et du ceil quand fViewHeight est à 1
     */
    renderFlatsVH1(ctx) {
        const WORLD = this._world;
        const SCREEN = WORLD.screen;
        const METRICS = WORLD.metrics;
        const VISUAL = WORLD.visual;
        const oFlatContext = this._flatContext;
        let x,
            y,
            xStart = 0,
            xEnd = SCREEN.width - 1,
            w = SCREEN.width,
            h = SCREEN.height >> 1;
        const renderContext = ctx.renderContext;
        if (oFlatContext.imageData === null) {
            oFlatContext.imageData = oFlatContext
                .image
                .getContext('2d')
                .getImageData(0, 0, oFlatContext.image.width, oFlatContext.image.height);
            oFlatContext.imageData32 = new Uint32Array(oFlatContext.imageData.data.buffer);
        }
        oFlatContext.renderSurface = renderContext.getImageData(0, 0, w, h << 1);
        oFlatContext.renderSurface32 = new Uint32Array(oFlatContext.renderSurface.data.buffer);
        const aFloorSurf = oFlatContext.imageData32;
        const aRenderSurf = oFlatContext.renderSurface32;
        // 1 : créer la surface
        const {direction, fov} = ctx.camera;
        const wx1 = Math.cos(direction - fov);
        const wy1 = Math.sin(direction - fov);
        const wx2 = Math.cos(direction + fov);
        const wy2 = Math.sin(direction + fov);

        const ps = METRICS.spacing;
        const yTexture = METRICS.height;
        const yTexture2 = yTexture >> 1;
        const fvh = 1;

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
        let wyCeil;

        let oCam = ctx.camera;
        let xCam = oCam.x; // coord caméra x
        let yCam = oCam.y; // coord caméra y
        let nFloorWidth = oFlatContext.image.width; // taille pixel des tiles de flats
        let ofsSrc; // offset de l'array pixel source
        let xOfs = 0; // code du block flat à afficher
        let yOfs = 0; // luminosité du block flat à afficher
        let nBlock;
        let xyMax = this.getMapSize() * ps;
        let sh = VISUAL.shading;
        let st = sh.threshold - 1;
        let sf = sh.factor;
        let aMap = this._map;
        let F = this._cellCodes;
        let aFBlock;

        let fy64, fx64;
        let oXMap = this._csm;
        let oXBlock, oXBlockImage;
        let oXBlockCeil;
        let nXDrawn = 0; // 0: pas de texture perso ; 1 = texture perso sol; 2=texture perso plafond
        let fBx, fBy;

        let bCeil = true;

        for (y = 1; y < h; ++y) {
            fBx = wx1;
            fBy = wy1;

            // floor
            dFront = fh * ff / y;
            fy = wy1 * dFront + yCam;
            fx = wx1 * dFront + xCam;
            xDeltaFront = xDelta * dFront;
            yDeltaFront = yDelta * dFront;
            wy = w * (h + y);
            wyCeil = w * (h - y - 1);
            yOfs = Math.min(st, dFront / sf | 0);

            for (x = 0; x < w; ++x) {
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
                                ofsSrc = (((fy % ps) + yOfs * ps | 0) * nFloorWidth + (((fx % ps) + xOfs * ps | 0)));
                                aRenderSurf[ofsDst] = aFloorSurf[ofsSrc];
                            }
                            if (bCeil && nXDrawn !== 2) {
                                xOfs = aFBlock[5];
                                if (xOfs >= 0) {
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
        ctx.renderContext.putImageData(oFlatContext.renderSurface, 0, 0);
    }




    /**
     * Rendu du floor et du ceil si le fViewHeight est différent de 1
     * (presque double ration de calcul....)
     */
    renderFlatsVHX(ctx) {
        const WORLD = this._world;
        const SCREEN = WORLD.screen;
        const METRICS = WORLD.metrics;
        const VISUAL = WORLD.visual;
        const oFlatContext = this._flatContext;
        let x,
            y,
            xStart = 0,
            xEnd = SCREEN.width - 1,
            w = SCREEN.width,
            h = SCREEN.height >> 1;
        const renderContext = ctx.renderContext;
        if (oFlatContext.imageData === null) {
            oFlatContext.imageData = oFlatContext
                .image
                .getContext('2d')
                .getImageData(0, 0, oFlatContext.image.width, oFlatContext.image.height);
            oFlatContext.imageData32 = new Uint32Array(oFlatContext.imageData.data.buffer);
        }
        oFlatContext.renderSurface = renderContext.getImageData(0, 0, w, h << 1);
        oFlatContext.renderSurface32 = new Uint32Array(oFlatContext.renderSurface.data.buffer);
        const aFloorSurf = oFlatContext.imageData32;
        const aRenderSurf = oFlatContext.renderSurface32;
        // 1 : créer la surface
        const {direction, fov} = ctx.camera;
        const wx1 = Math.cos(direction - fov);
        const wy1 = Math.sin(direction - fov);
        const wx2 = Math.cos(direction + fov);
        const wy2 = Math.sin(direction + fov);

        const ps = METRICS.spacing;
        const yTexture = METRICS.height;
        const yTexture2 = yTexture >> 1;
        const fvh = ctx.camera.height;

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

        let fhCeil = yTexture2 + ((fvh - 1) * yTexture2);
        let xDeltaFrontCeil = 0;
        let yDeltaFrontCeil = 0;
        let fxCeil = 0, fyCeil = 0; // coordonnée du texel finale
        let dFrontCeil; // distance "devant caméra" du pixel actuellement pointé
        let ofsDstCeil; // offset de l'array pixel de destination (plafon)
        let wyCeil = 0;

        let xCam = ctx.camera.x; // coord caméra x
        let yCam = ctx.camera.y; // coord caméra y
        let nFloorWidth = oFlatContext.image.width; // taille pixel des tiles de flats
        let ofsSrc; // offset de l'array pixel source
        let xOfs = 0; // code du block flat à afficher
        let yOfs = 0; // luminosité du block flat à afficher
        let nBlock;
        let xyMax = this.getMapSize() * ps;
        let sh = VISUAL.shading;
        let st = sh.threshold - 1;
        let sf = sh.factor;
        let aMap = this._map;
        let F = this._cellCodes;
        let aFBlock;


        let bCeil = true;

        // aFloorSurf -> doit pointer vers XMap.get(x, y)[4].imageData32
        // test : if XMap.get(x, y)[4]

        let fy64, fx64;
        let oXMap = this._csm;
        let oXBlock, oXBlockCeil, oXBlockImage;
        let fBx, fBy, yOfsCeil;


        for (y = 1; y < h; ++y) {
            fBx = wx1;
            fBy = wy1;

            // floor
            dFront = fh * ff / y;
            fy = wy1 * dFront + yCam;
            fx = wx1 * dFront + xCam;
            xDeltaFront = xDelta * dFront;
            yDeltaFront = yDelta * dFront;
            wy = w * (h + y);
            yOfs = Math.min(st, dFront / sf | 0);

            // ceill
            if (bCeil) {
                dFrontCeil = fhCeil * ff / y;
                fyCeil = wy1 * dFrontCeil + yCam;
                fxCeil = wx1 * dFrontCeil + xCam;
                xDeltaFrontCeil = xDelta * dFrontCeil;
                yDeltaFrontCeil = yDelta * dFrontCeil;
                wyCeil = w * (h - y);
                yOfsCeil = Math.min(st, dFrontCeil / sf | 0);
            }
            for (x = 0; x < w; ++x) {
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
                if (bCeil && fxCeil >= 0 && fyCeil >= 0 && fxCeil < xyMax && fyCeil < xyMax) {
                    fy64 = fyCeil / ps | 0;
                    fx64 = fxCeil / ps | 0;
                    oXBlockCeil = oXMap.getSurface(fx64, fy64, 5);
                    if (oXBlockCeil.imageData32) {
                        oXBlockImage = oXBlockCeil.imageData32;
                        ofsSrc = (((fyCeil  % ps) + yOfs * ps | 0) * ps + (((fxCeil % ps) | 0)));
                        aRenderSurf[ofsDstCeil] = oXBlockImage[ofsSrc];
                    } else {
                        nBlock = aMap[fy64][fx64] & 0xFFF; // **code12** code
                        aFBlock = F[nBlock];
                        if (aFBlock !== null) {
                            xOfs = aFBlock[5];
                            if (xOfs !== null) {
                                ofsSrc = (((fyCeil % ps) + yOfs * ps | 0) * nFloorWidth + (((fxCeil % ps) + xOfs * ps | 0)));
                                aRenderSurf[ofsDstCeil] = aFloorSurf[ofsSrc];
                            }
                        }
                    }
                }
                if (bCeil) {
                    fyCeil += yDeltaFrontCeil;
                    fxCeil += xDeltaFrontCeil;
                }
                fy += yDeltaFront;
                fx += xDeltaFront;
            }
        }
        ctx.renderContext.putImageData(oFlatContext.renderSurface, 0, 0);
    }



}

export default Raycaster;
