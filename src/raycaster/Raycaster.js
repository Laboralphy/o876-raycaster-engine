import TileSet from './TileSet';
import ShadedTileSet from './ShadedTileSet';
import MarkerRegistry from './MarkerRegistry';
import CellSurfaceManager from './CellSurfaceManager';
import * as CONSTS from './consts';



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
                height: 96,	        // wallXed height of walls
                spacing: 64,         // size of a cell, on the floor
            },
            screen: {
                height: 250,	        // matches the number of pixels on the vertical axis
                width: 800,           // matches the number of pixels on the horizontal axis
                fov: Math.PI / 4
            },
            visual: {		        // all things visual
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
		this._csm = new CellSurfaceManager();
        this._cellCodes = []; // this is an array of array of sides

        this._zbuffer = null; // array of drawing operation
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
        this._walls = Raycaster.buildTileSet(
            oImage,
            width,
            height,
            this._world.visual.shading.threshold
        );
    }

    setFlatTextures(oImage) {
        let width = this._world.metrics.spacing;
        this._flats = Raycaster.buildTileSet(
            oImage,
            width,
            width,
            this._world.visual.shading.threshold
        );
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
    createContext(xCamera, yCamera, fDirection) {
        return {         // raycasting context
            camera: {
                x: xCamera,             // camera position
                y: yCamera,             // ...
                angle: this._world.screen.fov,    // camera view angle
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


    static _optimizeBuffer(zb) {
        // Optimisation ZBuffer -> suppression des drawScreenSlice inutile, élargissement des drawScreenSlice utiles.
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
    computeScreenSliceBuffer(xCamera, yCamera, fDirection) {
        const METRICS = this._world.metrics;
        const SCREEN = this._world.screen;
        let hScreenSize = SCREEN.width;
        let vScreenSize = SCREEN.height;
        let fViewAngle = SCREEN.fov;
        let nSpacing = METRICS.spacing;
        let fAngleLeft = fDirection - fViewAngle;       // angle value at the leftmost screen column
        let fAngleRight = fDirection + fViewAngle;      // angle value at the rightmost screen column
        let wx1 = Math.cos(fAngleLeft);             // w1 = (wx1, wy1) is a normalized position around camera for the leftmost point
        let wy1 = Math.sin(fAngleLeft);
        let wx2 = Math.cos(fAngleRight);            // w2 = (wx2, wy2) is a normalized position around camera for the rightmost point
        let wy2 = Math.sin(fAngleRight);
        let dx = (wx2 - wx1) / hScreenSize;               // dx, dy help to determine all points between w1 and w2
        let dy = (wy2 - wy1) / hScreenSize;
        let fBx = wx1;                              // starting point for the raycasting process
        let fBy = wy1;                              // (fBx, fBy) is meant to be modified by (dx, dy)
        let xCam8 = xCamera / nSpacing | 0;         // cell where the camera is.
        let yCam8 = yCamera / nSpacing | 0;
        let i;
        let zbuffer = [];
        let scanSectors = new MarkerRegistry();     // registry of cells traversed by rays
        scanSectors.mark(xCam8, yCam8);
        // background

		// continue ray

		// VR
		let b3d = false;
		let xLimitL = 0;
		let xLimitR = vScreenSize;

		// defines left and right limits ; no ray will be cast outside these limits
        let xl = b3d ? xLimitL : 0;
        let xr = b3d ? xLimitR : vScreenSize;

        let ctx = this.createContext(xCamera, yCamera, fDirection);

        for (i = 0; i < vScreenSize; ++i) {
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
        //this._zbuffer = zbuffer;
        return zbuffer;
	}

    /**
     * casts a ray, this may lead to the production of several drawOps, which are immediatly stored into the buffer
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
        //var oBG = this.oBackground;
        do {
            this.projectRay(ctx, x, y, dx, dy, exclusionRegistry, visibleRegistry);
            if (ctx.exterior) {
                // hors du laby
                // if (oBG) {
                // zbuffer.push(this.computeExteriorDrawOp(xScreen, ctx.distance));
                //     this.drawExteriorLine(xScreen, ctx.distance);
                // }
            } else if (ctx.distance >= 0) {
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




    /** Lance un rayon dans la map actuelle
     * Lorsque le rayon frappe un mur opaque, il s'arrete et la fonction renvoie la liste
     * des secteur traversé (visible).
     * La fonction mets à jour un objet contenant les propriétés suivantes :
     *   cellCode    : Code du Paneau (texture) touché par le rayon
     *   wallXed     : Type de coté (X ou Y)
     *   cellSide     : Coté
     *   wallColumn      : Position du point d'impact du rayon sur le mur
     *   xCell         : position du mur sur la grille
     *   yCell         :  "       "       "       "
     *   distance         : longueur du rayon
     * @param ctx objet de retour
     * @param x position de la camera
     * @param y    "      "      "
     * @param dx pente du rayon x (le cosinus de son angle)
     * @param dy pente du rayon y (le sinus de son angle)
     * @param exclusionRegistry tableau des cases semi transparente que le rayon peut traverser
     * @param visibleRegistry tableau des cases visitées par le rayon
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
                        if (Raycaster.sameOffsetWall(nOfs, xint, yint, xi, yi, dx, dy, nScale)) { // Même mur -> porte
                            nTOfs = (dxt / nScale) * nOfs;
                            yint = y + yScale * (xt + nTOfs);
                            if (((yint / nScale | 0)) !== yi) {
                                nPhys = nText = 0;
                            }
                            if (nText !== 0	&& exclusionRegistry.isMarked(xi, yi)) {
                                nPhys = nText = 0;
                            }
                        } else { // pas même mur -> wall
                            nPhys = nText = 0;
                        }
                    } else {
                        nTOfs = 0;
                    }
                    // 0xB00 : INVISIBLE_BLOCK ou vide 0x00
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
                        // PHYS_SECRET ou PHYS_TRANSPARENT
                        nOfs = (nText >> 16) & 0xFF; // **Code12** offs
                    } else {
                        nOfs = 0;
                    }

                    if (nOfs) {
                        xint = x + xScale * yt;
                        yint = y + yScale * yt;
                        if (Raycaster.sameOffsetWall(nOfs, xint, yint, xi, yi, dx, dy, nScale)) { // Même mur -> porte
                            nTOfs = (dyt / nScale) * nOfs;
                            xint = x + xScale * (yt + nTOfs);
                            if (((xint / nScale | 0)) !== xi) {
                                nPhys = nText = 0;
                            }
                            if (nText !== 0	&& exclusionRegistry.isMarked(xi, yi)) {
                                nPhys = nText = 0;
                            }
                        } else { // pas même mur -> wall
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
                //			t = 100;
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
                ctx.wallColumn = ctx.spacing - ctx.wallColumn;
                ctx.cellSide = 2;
            }
            if (!ctx.wallXed && dyi > 0) {
                ctx.wallColumn = ctx.spacing - ctx.wallColumn;
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
        }
    }

    /**
     * This function will return true if both ""
     * @param nOfs
     * @param x0
     * @param y0
     * @param xm
     * @param ym
     * @param fBx
     * @param fBy
     * @param ps
     * @returns {boolean}
     */
    static sameOffsetWall(nOfs, x0, y0, xm, ym, fBx, fBy, ps) {
        x0 += nOfs * fBx;
        y0 += nOfs * fBy;
        let ym2, xm2;
        ym2 = y0 / ps | 0;
        xm2 = x0 / ps | 0;
        return xm2 === xm && ym2 === ym;
    }

    /**
	 * returns true if the wall is transparent :
	 * A transparent wal is a real wall (not air), but the rays can pass through
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


    /**
     * @param ctx {*} raycasting context
     * @param x {number} final screen column position
     * @param oTileSet {ShadedTileSet} tileset used for rendering
     * @param iTile {number} index of tile
     * @param nLight {number}
     */
    createScreenSlice(ctx, x, oTileSet, iTile, nLight) {
        let z = Math.max(0.1, ctx.distance);
        let nPos = ctx.wallColumn;
        let bDim = ctx.wallXed;
        let nPanel = ctx.cellCode;

        const WORLD = this._world;
        const SCREEN = WORLD.screen;
        const SHADING = WORLD.visual.shading;
        let ytex = this._world.metrics.height;
        let xtex = this._world.metrics.spacing;
        let yscr = SCREEN.height;
        let shf = SHADING.factor;
        let sht = SHADING.threshold;
        let dmw = SHADING.dim;
        let fvh = ctx.camera.height;
        let dz = (ytex * yscr / z) + 0.5 | 0;
        let dzy = yscr - (dz * fvh);
        let nPhys = (nPanel >> 12) & 0xF;  // **code12** phys
        let nOffset = (nPanel >> 16) & 0xFF; // **code12** offs
        let nOpacity = z / shf | 0;
        if (bDim) {
            nOpacity = (sht - dmw) * nOpacity / sht + dmw - nLight | 0;
        } else {
            nOpacity -= nLight;
        }
        nOpacity = Math.max(0, Math.min(sht, nOpacity));
        let aData = [
            oTileSet.getTileSet(nOpacity).getImage(), // image 0
            iTile * xtex + nPos, // sx  1
            0, // sy  2
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
                    aData[8] = ((aData[4] / (z / yscr) + 0.5)) << 1;
                }
                break;

            case CONSTS.PHYS_CURT_SLIDING_UP: // rideau coulissant vers le haut
                if (nOffset > 0) {
                    aData[8] = (((ytex - nOffset) / (z / yscr) + 0.5)) << 1;
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
                    aData[8] = ((aData[4] / (z / yscr) + 0.5));
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
                        if ((nPos) > ((xtex >> 1) - nOffset)) {
                            aData[0] = null;
                        } else {
                            aData[1] = (nPos + nOffset) % xtex + iTile;
                        }
                    } else {
                        if ((nPos) < ((xtex >> 1) + nOffset)) {
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

    computeExteriorScreenSlice(x, z) {
        let dz, sx, sy, sw, sh, dx, dy, dw, dh;
        if (z < 0.1) {
            z = 0.1;
        }
        dz = (this.yTexture / (z / this.yScrSize));
        let dzfv = (dz * this.fViewHeight);
        let dzy = this.yScrSize - dzfv;
        // dz = demi hauteur de la texture projetée
        let oBG = this.oBackground;
        let wBG = oBG.width, hBG = oBG.height;
        sx = (x + this.fCameraBGOfs) % wBG | 0;
        sy = Math.max(0, (hBG >> 1) - dzfv);
        sw = 1;
        sh = Math.min(hBG, dz << 1);
        dx = x;
        dy = Math.max(dzy, this.yScrSize - (hBG >> 1));
        dw = sw;
        dh = Math.min(sh, dz << 1);
        return [ oBG, sx, sy, sw, sh, dx, dy, dw, dh, z, 0 ];
    }


    /**
     * Renders all DrawOps stored in the buffer into the screen
     * @param zbuffer {array}
     * @param context {CanvasRenderingContext2D}
     */
    static renderScreenSliceBuffer(zbuffer, context) {
        for (let i = 0, l = zbuffer.length; i < l; ++i) {
            Raycaster.drawScreenSlice(zbuffer[i], context);
        }
    }

    /**
     * Renders the portion of texture described in the zbi parameter
     * @param zbi {array} array of parameters mapped into the contex2d.drawScreenSlice function
     * @param rc {CanvasRenderingContext2D} context where the line is rendered
     */
    static drawScreenSlice(zbi, rc) {
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
        // Si xStart est négatif c'est qu'on est sur un coté de block dont la texture est indéfinie (-1)
        // Firefox refuse de dessiner des textures "négative" dont on skipe le dessin
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
}

export default Raycaster;
