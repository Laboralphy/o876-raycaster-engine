import CanvasHelper from '../canvas-helper/CanvasHelper';
import Rainbow from '../rainbow';


const SHADING_LAYERS = 16;

/**
 * This class manages several a tileset and is able to pre-compute a shading effect, in order to optimize rendering time.
 */
class ShadedTileSet {
	constructor() {
		this._shadingLayers = SHADING_LAYERS;
		this._bShading = true;
		this._image = null;
		this._originalImage = null;
        this._tileWidth = 0;
        this._tileHeight = 0;
        this._bEconomize = false;
        this._oCvsPre = null;
        this._prevReqTile = null;
        this._prevReqLevel = null;
        this._prevShadingParams = {
        	fog: null,
			filter: null,
			amb: null,
		};
		this._aFogStyles = []; // an array of style for each shaing layers
	}

	get economize() {
		return this._bEconomize;
	}

	/**
	 * When the economize flag is on, the tileset will enter "Economy Mode"
	 * in this mode, a sprite with 80 frames, 64x96 each frame will consume 3932160 byte
	 * when the "Economy Mode" is off, the same sprite will consume 31457280 bytes (8 times more)
	 * @param value
	 */
	set economize(value) {
		this._bEconomize = value;
		this.recompute();
	}

    get tileWidth() {
        return this._tileWidth;
    }

    get tileHeight() {
        return this._tileHeight;
    }

    set shading(value) {
		this._bShading = value;
	}

	get shading() {
		return this._bShading;
	}

    /**
	 * defines the number of shading layer (default 16)
	 * the more layers, the smoother the shading looks
     * @param n {number}
     */
    setShadingLayerCount(n) {
        this._shadingLayers = n;
    }

    /**
     * gets the number of shading layer
     * @return {number}
     */
    getShadingLayerCount() {
    	if (this._bShading) {
			return this._shadingLayers;
		} else {
    		return 1;
		}
    }

    /**
	 * This function will keep updateEntity of the original unmodified tileset
	 * the shading computations will not alter this original image, so the computation may be rerun with
	 * other visual setting, fog pigment etc...
     * @param oImage {Image|HTMLCanvasElement}
     * @param w {number} size of a tile
     * @param h {number}
     */
	setImage(oImage, w, h) {
        if (CanvasHelper.isImage(oImage)) {
        	oImage = CanvasHelper.cloneCanvas(oImage);
		}
        this._originalImage = oImage;
        this._tileWidth = w;
        this._tileHeight = h;
	}

	getOriginalImage() {
		return this._originalImage;
	}

    /**
	 * Returns the shaded tileset image
     * @returns {HTMLCanvasElement}
     */
	getImage() {
		return this._image;
	}

	recompute() {
		if (!this._image) {
			return;
		}
		const pp = this._prevShadingParams;
		this.compute(pp.fog, pp.filter, pp.amb);
	}

    /**
	 * run shading computation. Original tileset must have been set
     * @param sColorFog {string} color of fog
     * @param sColorFilter {boolean|string} color filter
     * @param fAmbLightness {number}
     */
	compute(sColorFog, sColorFilter, fAmbLightness) {
		const pp = this._prevShadingParams;
		// remember shading parameters
		pp.fog = sColorFog;
		pp.filter = sColorFilter;
		pp.amb = fAmbLightness;
		let sl = this._bEconomize ? 1 : this.getShadingLayerCount();
		const oOrigImg = this._originalImage;
		const oImg = CanvasHelper.createCanvas(oOrigImg.width, oOrigImg.height * sl);
		const ctx = oImg.getContext('2d');
		const h = oOrigImg.height;
		this._aFogStyles = [];
		for (let i = 0; i < this.getShadingLayerCount(); ++i) {
			const fFactor = Math.min(i / (this.getShadingLayerCount() - 1), 1) * (1 - fAmbLightness);
			this._aFogStyles[i] = this.computeFogStyle(sColorFog, fFactor);
		}
		for (let i = 0; i < sl; ++i) {
			ctx.drawImage(this.shadeImage(oOrigImg, i, sColorFog, sColorFilter), 0, i * h);
		}
		this._image = oImg;
	}


	prepareCvsPre(iTile, nLevel) {
        if (this._prevReqTile === iTile && this._prevReqLevel === nLevel) {
            return this._oCvsPre;
        }
        this._prevReqTile = iTile;
        this._prevReqLevel = nLevel;
	    if (!this._oCvsPre) {
            this._oCvsPre = this.extractTile(iTile, 0);
        } else {
            this.extractTile(iTile, 0, this._oCvsPre);
        }
	    //const sl = this.getShadingLayerCount();
		//const fFactor = Math.min(nLevel / (sl - 1), 1) * (1 - pp.amb);
		this.applyFogShading(this._oCvsPre, nLevel);
	    return this._oCvsPre;
    }


	/**
	 * Draw the tileset inside another canvas
	 * @param oContext {CanvasRenderingContext2D} context where to draw the tileset
	 * @param sx
	 * @param sy
	 * @param sw
	 * @param sh
	 * @param dx
	 * @param dy
	 * @param dw
	 * @param dh
	 */
	drawTile(oContext, sx, sy, sw, sh, dx, dy, dw, dh) {
	    if (this.economize) {
	    	const w = this._tileWidth;
	    	const h = this._tileHeight;
            oContext.drawImage(
            	this.prepareCvsPre(sx / w | 0, sy / h | 0),
				sx % w, sy % h, sw, sh, dx, dy, dw, dh
			);
        } else {
            oContext.drawImage(
                this.getImage(),
                sx, sy, sw, sh, dx, dy, dw, dh
            );
        }
    }


    /**
	 * extract a fragment (containing only one tile) of the shaded tileset into a new one
	 * @param iTile {number}
	 * @param nLevel {number} level of lightness (if ommittted all levels are cloned)
     * @param oFragment {HTMLCanvasElement} an optional canvas
	 * @return {HTMLCanvasElement}
     */
	extractTile(iTile, nLevel, oFragment = null) {
		const w = this._tileWidth;
		const h = this._tileHeight;
		const x = iTile * w;
		if (oFragment === null) {
		    oFragment = CanvasHelper.createCanvas(w, h);
        }
		const ctx = oFragment.getContext('2d');
        ctx.clearRect(0, 0, w, h);
        // will use originalImage if computedImage is not present
        const oImage = !!this._image ? this._image : this._originalImage;
		if (this.economize) {
            ctx.drawImage(oImage, x, 0, w, h, 0, 0, w, h);
        } else {
            const y = h * nLevel;
            ctx.drawImage(oImage, x, y, w, h, 0, 0, w, h);
        }
		return oFragment;
	}



	computeFogStyle(sColorFog, fFactor) {
		let g = Rainbow.parse(sColorFog);
		g.a = fFactor * 255 | 0;
		return Rainbow.rgba(g);
	}

	applyFogShading(oShaded, nLevel) {
		const oCtx = oShaded.getContext('2d');
		oCtx.save();
		oCtx.globalCompositeOperation = 'source-atop';
		oCtx.fillStyle = this._aFogStyles[nLevel];
		oCtx.fillRect(0, 0, oShaded.width, oShaded.height);
		oCtx.restore();
		return oShaded;
	}


	/**
	 * Shades an image.
	 * @param oImage {HTMLCanvasElement}
	 * @param nLevel {number} shade factor (0 = no shading ; 1 = maximum shading)
	 * @param sColorFog {string} fog color
	 * @param sColorFilter {string} ambiant color filter (for sprites)
	 */
	shadeImage(oImage, nLevel, sColorFog, sColorFilter) {
		let oShaded = CanvasHelper.cloneCanvas(oImage);
		if (!!sColorFilter) {
			let oColorFilter = Rainbow.parse(sColorFilter);
			oColorFilter.r /= 128;
			oColorFilter.g /= 128;
			oColorFilter.b /= 128;
			this.applyColorFilter(oShaded, oColorFilter);
		}
		this.applyFogShading(oShaded, nLevel);
		return oShaded;
	}

	/**
	 * Will apply a color filter to the given texture
	 * The filter is an rbg structure with float factor values
	 * {r: 1, g: 1, b: 1} is a neutral filter and will not change any pixel
	 * {r: 1, g: 0.5, b: 0.5} will greatly dim green and blue channel, making the texture more red.
	 * @param oImage {HTMLCanvasElement}
	 * @param oColorFilter {r, g, b}
	 */
	applyColorFilter(oImage, oColorFilter) {
		let {r, g, b} = oColorFilter;
		CanvasHelper.applyFilter(oImage, (x, y, color) => {
			color.r *= r;
			color.g *= g;
			color.b *= b;
		});
	}

	getMemoryUsage() {
		return this._image.width * this._image.height * 4 +
			this._originalImage.width * this._originalImage.height * 4 +
			(!!this._oCvsPre ? this._oCvsPre.width * this._oCvsPre.height * 4 : 0);
	}
}

export default ShadedTileSet;
