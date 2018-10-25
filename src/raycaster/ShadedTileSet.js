import CanvasHelper from './CanvasHelper';
import Rainbow from './Rainbow';
import TileSet from './TileSet';


const SHADING_LAYERS = 16;

/**
 * This class manages several layers of tilesets,
 * layers have differents shade factors.
 * This class will compute a shading effect on a tileset
 * in order to optimize rendering time
 */
class ShadedTileSet {

	constructor() {
		this._shadingLayers = SHADING_LAYERS;
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
	 * This function will instanciate a TileSet before shading it
	 * so the application using ShadedTileSet doesn't require to import TileSet any longer.
     * @param oImage {Image|HTMLCanvasElement}
     * @param w {number} size of a tile
     * @param h {number}
     */
	setImage(oImage, w, h) {
		let ts = new TileSet();
		ts.setTileWidth(w);
		ts.setTileHeight(h);
		ts.setImage(oImage);
		this.setTileSet(ts);
	}
	
	setTileSet(ts) {
		ts.rebuildOneRow();
		this._originalTileSet = ts;
	}
	
	/**
	 * Defines the original tileset and run computation
	 */
	compute(sColorFog, sColorFilter, fAmbLightness) {
		this._tileSets = [];
		let ots = this._originalTileSet;
		for (let i = 0; i < this._shadingLayers; ++i) {
			let fFactor = Math.min(i / (this._shadingLayers - 1), 1) * (1 - fAmbLightness);
			let ts = new TileSet();
			ts.setTileWidth(ots.getTileWidth());
			ts.setTileHeight(ots.getTileHeight());
			ts.setImage(this.shadeImage(ots.getImage(), fFactor, sColorFog, sColorFilter));
			this._tileSets.push(ts);
		}
	}


    /**
	 * extract a fragment (containing only one tile) of the shaded tileset into a new one
     */
	createFragment(iTile) {
		const ots = this._originalTileSet;
        const w = ots.getTileWidth();
        const h = ots.getTileHeight();
        const nsts = new ShadedTileSet();
        nsts.setShadingLayerCount(this.getShadingLayerCount());
        nsts._tileSets = [];
		for (let i = 0, l = this.getShadingLayerCount(); i < l; ++i) {
			let ts = this._tileSets[i];
			let nts = new TileSet();
			nts.setTileWidth(w);
			nts.setTileHeight(h);
			nts.setImage(ts.getImageFragment(iTile));
            nsts._tileSets.push(nts);
		}
		return nsts;
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
		if (sColorFilter !== false) {
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
		console.log(r, g, b);
		CanvasHelper.applyFilter(oImage, (x, y, color) => {
			color.r *= r;
			color.g *= g;
			color.b *= b;
		});
	}
	
	getTileRect(nTileIndex, nShadeIndex) {
		return this
			._tileSets[nShadeIndex]
			.getTileRect(nTileIndex);
	}
}

export default ShadedTileSet;
