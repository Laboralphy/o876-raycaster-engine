import TileSet from './TileSet';
import ShadedTileSet from './ShadedTileSet';
import MarkerRegistry from './MarkerRegistry';
import CellSurfaceManager from './CellSurfaceManager';
import * as CONSTS from './consts';


class Raycaster {
	
	constructor() {
		this._world = {};
		this._map = [];
        this._walls = []; // wall shaded tileset
        this._flats = []; // flat shaded tileset
		this._csm = new CellSurfaceManager();

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
	 * @param width {number} tile width
	 * @param height {number} tile height
	 */
    setWallTextures(oImage, width, height) {
        this._walls = this.buildTileSet(oImage, width, height);
    }

    setFlatTextures(oImage, width, height) {
        this._flats = this.buildTileSet(oImage, width, height);
    }

    /**
	 * builds a tileset of texture, out of an image, and shades it
     * @param oImage
     * @param width
     * @param height
     */
    static buildTileSet(oImage, width, height) {
        const sw = new ShadedTileSet();
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
        this._csm.setMapSize(nSize);
	}

	getMapSize() {
		return this._map.length;
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
    setCellTexture(x, y, code) {
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
	getCellTexture(x, y) {
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
	 * this is phase 1 of rendering.
	 * Builds an array of drawing operations
     */
    computeDrawingOps({
		xCamera,
		yCamera,
		fAngle,
		fViewAngle,
		hSize,
		vSize,
		nSpacing
    }) {
        let fAngleLeft = fAngle - fViewAngle;       // angle value at the leftmost screen column
        let fAngleRight = fAngle + fViewAngle;      // angle value at the rightmost screen column
        let wx1 = Math.cos(fAngleLeft);             // w1 = (wx1, wy1) is a normalized position around camera for the leftmost point
        let wy1 = Math.sin(fAngleLeft);
        let wx2 = Math.cos(fAngleRight);            // w2 = (wx2, wy2) is a normalized position around camera for the rightmost point
        let wy2 = Math.sin(fAngleRight);
        let dx = (wx2 - wx1) / hSize;               // dx, dy help to determine all points between w1 and w2
        let dy = (wy2 - wy1) / hSize;
        let fBx = wx1;                              // starting point for the raycasting process
        let fBy = wy1;                              // (fBx, fBy) is meant to be modified by (dx, dy)
        let xCam8 = xCamera / nSpacing | 0;         // cell where the camera is.
        let yCam8 = yCamera / nSpacing | 0;
        let i;
        let aZBuffer = [];
        let scanSectors = new MarkerRegistry();     // registry of cells traversed by rays
        scanSectors.mark(xCam8, yCam8);
        // background

		// continue ray

		// VR
		let b3d = false;
		let xLimitL = 0;
		let xLimitR = vSize;

		// defines left and right limits ; no ray will be cast outside these limits
        let xl = b3d ? xLimitL : 0;
        let xr = b3d ? xLimitR : xScrSize;

        let ctx = {         // raycasting context
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

        for (i = 0; i < vSize; ++i) {
            if (i >= xl && i <= xr) { // checks limits
                ctx.resume.b = false;
                this.castRay(ctx, xCamera, yCamera, fBx, fBy, i, scanSectors);
            }
            fBx += dx;
            fBy += dy;
        }




	}

    /**
     * Calcule le caste d'un rayon
     */
    castRay(ctx, x, y, dx, dy, xScreen, visibleRegistry) {
        let exclusionRegistry = new MarkerRegistry();
        let oXBlock = null; // meta data
        let oTexture; // texture data
        let iTexture; // offset inside the texture
        let rTexture;
		let wWall = ctx.spacing;
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
                //     this.drawExteriorLine(xScreen, ctx.distance);
                // }
            } else if (ctx.distance >= 0) {
                if (xScreen !== undefined) {
                    oXBlock = this._csm.getSurface(ctx.xCell, ctx.yCell, ctx.cellSide);
                    if (oXBlock.tileset) {
                        oTexture = oXBlock.tileset;
                        iTexture = 0;
                    } else {
                        oTexture = this._walls;
                        iTexture = ctx.oWall.codes[ctx.cellCode & 0xFFF][ctx.cellSide] * wWall; // **code12** code
                    }
                    /*
                    this.drawLine(
                    	xScreen,
						ctx.distance,
						iTexture,
                        ctx.wallColumn | 0,
						ctx.wallXed,
						oTexture,
                        ctx.cellCode,
						oXBlock.diffuse
					);*/
                }
                if (ctx.resume.b) {
                    exclusionRegistry.mark(ctx.xCell, ctx.yCell);
                }
            }
            --nMaxIterations;
        } while (ctx.resume.b && nMaxIterations > 0);
        return visibleRegistry;
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
            ctx.wallColumn = ctx.wallXed ? yint % ctx.spacing
                : xint % ctx.spacing;
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

}

export default Raycaster;
