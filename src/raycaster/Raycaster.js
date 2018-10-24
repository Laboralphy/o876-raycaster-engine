import TileSet from './TileSet';
import ShadedTileSet from './ShadedTileSet';

class Raycaster {
	
	constructor() {
		this._world = {};
		this._map = [];
		this._walls = []; // wall shaded tileset
	}
	
	/**
	 * Defines the wall textures.
	 * @param oImage {HTMLCanvasElement|HTMLImageElement} this image contains all textures
	 * @param width {number} tile width
	 * @param height {number} tile height
	 */
	setWallTextures(oImage) {
		const world = this._world;
		const width = world.metrics.spacing;
		const height = world.metrics.height;
		const w = new TileSet();
		w.setTileWidth(width);
		w.setTileHeight(height);
		w.setImage(oImage);
		const sw = new ShadedTileSet();
		sw.setTileSet(w);
		sw.compute(world.visual.fog.color, world.visual.filter, world.visual.brightness);
		this._walls = sw;
	}
}

export default Raycaster;
