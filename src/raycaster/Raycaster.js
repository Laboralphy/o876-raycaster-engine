import TileSet from './TileSet';
import ShadedTileSet from './ShadedTileSet';
import MarkerRegistry from './MarkerRegistry';
import MetaMap from './MetaMap';
import * as CONSTS from './consts';


class Raycaster {
	
	constructor() {
		this._world = {};
		this._map = [];
        this._walls = []; // wall shaded tileset
        this._flats = []; // flat shaded tileset
		this._metamap = new MetaMap();
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
        const w = new TileSet();
        w.setTileWidth(width);
        w.setTileHeight(height);
        w.setImage(oImage);
        const sw = new ShadedTileSet();
        sw.setTileSet(w);
        return sw
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
        this._metamap.setSize(nSize);
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
        let fAngleLeft = fAngle - fViewAngle;
        let fAngleRight = fAngle + fViewAngle;
        let wx1 = Math.cos(fAngleLeft);
        let wy1 = Math.sin(fAngleLeft);
        let wx2 = Math.cos(fAngleRight);
        let wy2 = Math.sin(fAngleRight);
        let dx = (wx2 - wx1) / hSize;
        let dy = (wy2 - wy1) / hSize;
        let fBx = wx1;
        let fBy = wy1;
        let xCam8 = xCamera / nSpacing | 0;
        let yCam8 = yCamera / nSpacing | 0;
        let i;
        let aZBuffer = [];
        let scanSectors = new MarkerRegistry();
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

        let ctx = {
        	resume: {
        		b: false,
				xi: 0,
				yi: 0
			},
			exterior: false,
			distance: 0,
			spacing: this._world.metrics.spacing,
            nRayLimit: 100
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
		let wWall = this._world.metrics.spacing;
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
                    oXBlock = this._metamap.get(ctx.xWall, ctx.yWall, ctx.nSideWall);
                    if (oXBlock.surface) {
                        oTexture = oXBlock.surface;
                        iTexture = 0;
                    } else {
                        oTexture = ctx._walls;
                        iTexture = ctx.oWall.codes[ctx.nWallPanel & 0xFFF][ctx.nSideWall] * wWall; // **code12** code
                    }
                    /*
                    this.drawLine(
                    	xScreen,
						ctx.distance,
						iTexture,
                        ctx.nWallPos | 0,
						ctx.bSideWall,
						oTexture,
                        ctx.nWallPanel,
						oXBlock.diffuse
					);*/
                }
                if (ctx.resume.b) {
                    exclusionRegistry.mark(ctx.xWall, ctx.yWall);
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
     *   nWallPanel    : Code du Paneau (texture) touché par le rayon
     *   bSideWall     : Type de coté (X ou Y)
     *   nSideWall     : Coté
     *   nWallPos      : Position du point d'impact du rayon sur le mur
     *   xWall         : position du mur sur la grille
     *   yWall         :  "       "       "       "
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
        let nScale = this._world.metrics.spacing;

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
			cmax = ctx.nRayLimit,
			oResume = ctx.resume;

        if (oResume.b) {
        	// the projet ray will continue from these coordinates
            xi = oResume.xi;
            yi = oResume.yi;
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
                            if (nText !== 0	&& exclusionRegistryisMarked(xi, yi)) {
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
            ctx.nWallPanel = map[yi][xi];
            ctx.bSideWall = side === 1;
            ctx.nSideWall = side - 1;
            ctx.nWallPos = ctx.bSideWall ? yint % ctx.spacing
                : xint % ctx.spacing;
            if (ctx.bSideWall && dxi < 0) {
                ctx.nWallPos = ctx.spacing - ctx.nWallPos;
                ctx.nSideWall = 2;
            }
            if (!ctx.bSideWall && dyi > 0) {
                ctx.nWallPos = ctx.spacing - ctx.nWallPos;
                ctx.nSideWall = 3;
            }
            ctx.xWall = xi;
            ctx.yWall = yi;
            ctx.distance = t * nScale;
            ctx.exterior = false;
            if (this.isWallTransparent(ctx.xWall, ctx.yWall)) {
                oResume.b = true;
                oResume.xi = xi;
                oResume.yi = yi;
            } else {
                oResume.b = false;
            }
        } else {
            ctx.distance = t * nScale;
            ctx.exterior = true;
        }
    }

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
