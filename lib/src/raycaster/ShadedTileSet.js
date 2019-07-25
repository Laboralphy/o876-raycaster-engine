import CanvasHelper from '../canvas-helper/CanvasHelper';
import Rainbow from '../rainbow';


const SHADING_LAYERS = 16;

/**
 * This class manages several a tileset and is able to pre-compute a shading effect, in order to optimize rendering time.
 */
class ShadedTileSet {
	constructor() {
		this._shadingLayers = SHADING_LAYERS;
		this._image = null;
		this._originalImage = null;
        this._tileWidth = 0;
        this._tileHeight = 0;
	}

    get tileWidth() {
        return this._tileWidth;
    }

    get tileHeight() {
        return this._tileHeight;
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
        return this._shadingLayers;
    }

    /**
	 * This function will keep track of the original unmodified tileset
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

    /**
	 * run shading computation. Original tileset must have been set
     * @param sColorFog {string} color of fog
     * @param sColorFilter {boolean|string} color filter
     * @param fAmbLightness {number}
     */
	compute(sColorFog, sColorFilter, fAmbLightness) {
		const sl = this._shadingLayers;
		const oOrigImg = this._originalImage;
		const oImg = CanvasHelper.createCanvas(oOrigImg.width, oOrigImg.height * sl);
		const ctx = oImg.getContext('2d');
		const h = oOrigImg.height;
		for (let i = 0; i < sl; ++i) {
			let fFactor = Math.min(i / (sl - 1), 1) * (1 - fAmbLightness);
			ctx.drawImage(this.shadeImage(oOrigImg, fFactor, sColorFog, sColorFilter), 0, i * h);
		}
		this._image = oImg;
	}


    /**
	 * extract a fragment (containing only one tile) of the shaded tileset into a new one
	 * @param iTile {number}
	 * @param [nLevel] {number} level of lightness (if ommittted all levels are cloned)
	 * @return {HTMLCanvasElement}
     */
	extractTile(iTile, nLevel) {
		const w = this._tileWidth;
		const h = this._tileHeight;
		const sl = this._shadingLayers;
		const fh = nLevel !== undefined ? h : h * sl;
		const x = iTile * w;
		const y = nLevel !== undefined ? h * nLevel : 0;
		const oFragment = CanvasHelper.createCanvas(w, fh);
		const ctx = oFragment.getContext('2d');
		ctx.drawImage(y === 0 ? this._originalImage : this._image, x, y, w, fh, 0, 0, w, fh);
		return oFragment;
	}
	
	
	/**
	 * Shades an image.
	 * @param oImage {HTMLCanvasElement}
	 * @param fFactor {number} shade factor (0 = no shading ; 1 = maximum shading)
	 * @param sColorFog {string} fog color
	 * @param sColorFilter {string} ambiant color filter (for sprites)
	 */
	shadeImage(oImage, fFactor, sColorFog, sColorFilter) {
		const oShaded = CanvasHelper.cloneCanvas(oImage);
		const oCtx = oShaded.getContext('2d');
		if (!!sColorFilter) {
			let oColorFilter = Rainbow.parse(sColorFilter);
			oColorFilter.r /= 128;
			oColorFilter.g /= 128;
			oColorFilter.b /= 128;
			this.applyColorFilter(oShaded, oColorFilter);
		}
		let g = Rainbow.parse(sColorFog);
		g.a = fFactor * 255 | 0;
		oCtx.drawImage(oShaded, 0, 0);
		oCtx.globalCompositeOperation = 'source-atop';
		oCtx.fillStyle = Rainbow.rgba(g);
		oCtx.fillRect(0, 0, oShaded.width, oShaded.height);
		oCtx.globalCompositeOperation = 'source-over';
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
}

export default ShadedTileSet;
