import CanvasHelper from './CanvasHelper';

/**
 * This class holds a set of tiles 
 */
class TileSet {

	setTileWidth(w) {
		this._width = w;
	}
	
	setTileHeight(h) {
		this._height = h;
	}
	
	getTileWidth() {
		return this._width;
	}
	
	getTileHeight() {
		return this._height;
	}
	
	getTileSetWidth() {
		let oImage = this._image;
		if (CanvasHelper.isImage(oImage)) {
			return oImage.naturalWidth;
		} else {
			return oImage.width;
		}
	}
	
	getTileSetHeight() {
		let oImage = this._image;
		if (CanvasHelper.isImage(oImage)) {
			return oImage.naturalHeight;
		} else {
			return oImage.height;
		}
	}
	
	setImage(oImage) {
		this._image = oImage;
		const w = this._width;
		const h = this._height;
		if (!w || !h) {
			throw new Error('TileSet.setImage : there is something strange about tile size. Both width and height must be > 0. (width = ' + w + ' ; height = ' + h + ')');
		}
		const nImageWidth = this.getTileSetWidth();
		this._tilesPerRow = nImageWidth / w | 0;
	}
	
	getImage() {
		return this._image;
	}
	
	/**
	 * Return the coordinates of the tile which index is given as parameter
	 * @param iTile {number} index of the wanted tile
	 * @return {x, y, width, height}
	 */
	getTileRect(iTile) {
		const tpr = this._tilesPerRow;
		const w = this._width;
		const h = this._height;
		let xTile = iTile % tpr;
		let yTile = iTile / tpr | 0;
		return {
			x: xTile * w,
			y: yTile * h,
			width: w,
			height: h
		}
	}
	
	/**
	 * returns the numbers of tiles
	 * @return {number}
	 */
	getTileCount() {
		const tpr = this._tilesPerRow;
		const w = this._width;
		const h = this._height;
		const inh = this.getTileSetHeight();
		let yTileCount = inh / h | 0;
		return yTileCount * tpr;
	}
	
	/**
	 * Rearranges the tileset so all tiles are on the same row
	 */
	rebuildOneRow() {
		const nTileCount = this.getTileCount();
		const w = this._width;
		const h = this._height;
		const oImage = this._image;
		
		const oCanvas = CanvasHelper.createCanvas(nTileCount * w, h);
		const oContext = oCanvas.getContext('2d');
		
		for (let i = 0; i < nTileCount; ++i) {
			let r = this.getTileRect(i);
			oContext.drawImage(
				oImage, 
				r.x, 
				r.y, 
				r.width, 
				r.height, 
				i * w, 
				0, 
				r.width, 
				r.height
			);
		}
		this._image = oCanvas;
	}
}

export default TileSet;
