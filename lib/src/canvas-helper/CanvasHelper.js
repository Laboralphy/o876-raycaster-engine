import * as crypto from 'crypto';

let bDefaultImageSmoothing = true;

class CanvasHelper {
	/**
	 * Create a new canvas, width the given size
	 * @param width {number}
	 * @param height {number}
	 * @return {HTMLCanvasElement}
	 */
	static createCanvas(width, height) {
		let c = document.createElement('canvas');
		c.width = width;
		c.height = height;
		CanvasHelper.setImageSmoothing(c, bDefaultImageSmoothing);
		return c;
	}

	static setDefaultImageSmoothing(b) {
        bDefaultImageSmoothing = b;
	}

	static getDefaultImageSmoothing() {
		return bDefaultImageSmoothing;
	}

	static getData(oCanvas, sType = 'image/png') {
		return oCanvas.toDataURL(sType);
	}

    /**
	 * Return a checksum of the image, in order to compare content
	 * @param oCanvas {HTMLCanvasElement}
	 * @param sType {string}
	 * @return {string}
     */
	static getHash(oCanvas, sType = 'md5') {
		return crypto.createHash(sType).update(CanvasHelper.getData(oCanvas)).hash('hex');
	}
	
	/**
	 * Sets canvas image smoothing flag on or off
	 * @param oCanvas {HTMLCanvasElement}
	 * @param b {boolean} true = smoothing on // false = smoothing off
	 */
	static setImageSmoothing(oCanvas, b) {
		let oContext = oCanvas.getContext('2d');
		oContext.imageSmoothingEnabled = b;
	}
	
	/**
	 * Returns canvas image smoothing flag
     * @param oCanvas {HTMLCanvasElement}
	 * @return {boolean} true = smoothing on // false = smoothing off
	 */
	static getImageSmoothing(oCanvas) {
		let oContext = oCanvas.getContext('2d');
		return !!oContext.imageSmoothingEnabled;
	}
	
	/**
	 * Returns true if parameter is an instance of a real canvas
     * @param c {*}
	 * @return {boolean}
	 */
	static isCanvas(c) {
		return c instanceof HTMLCanvasElement;
	}

	/**
	 * Returns true if parameter is an instance of an image
     * @param c {*}
	 * @return {boolean}
	 */
	static isImage(c) {
		return c instanceof Image;
	}

	/**
	 * Clones a canvas into a new one
	 * @param oCanvas {HTMLCanvasElement|Image} to be cloned
	 * @return  HTMLCanvasElement
	 */
	static cloneCanvas(oCanvas) {
		let w, h, b;
		if (CanvasHelper.isImage(oCanvas)) {
			let oImage = oCanvas;
			w = oImage.naturalWidth;
			h = oImage.naturalHeight;
			b = bDefaultImageSmoothing;
		} else {
			w = oCanvas.width;
			h = oCanvas.height;
			b = CanvasHelper.getImageSmoothing(oCanvas);
		}
		let c = CanvasHelper.createCanvas(w, h);
		c.getContext('2d').drawImage(oCanvas, 0, 0);
		return c;
	}

	/**
	 * Applies a function filter on each pixel of the given canvas
	 * Warning : this function is rather slow
	 * @param oCanvas {HTMLCanvasElement} Canvas to be processed
	 * @param f {function} f(x, y, {r, g, b, a}} 
	 *
	 */
	static applyFilter(oCanvas, f) {
		const oCtx = oCanvas.getContext('2d');
		const W = oCanvas.width;
		const H = oCanvas.height;
		const oImgData = oCtx.getImageData(0, 0, W, H);
		const aPixData = oImgData.data;
		const nPixCount = aPixData.length;		
		const color = {r: 0, g: 0, b: 0, a: 0};
		let x = 0, y = 0;
		for (let iPix = 0; iPix < nPixCount; iPix += 4) {
			color.r = aPixData[iPix];
			color.g = aPixData[iPix + 1];
			color.b = aPixData[iPix + 2];
			color.a = aPixData[iPix + 3];
			f(x, y, color);
			aPixData[iPix]     = Math.min(255, Math.max(0, color.r | 0));
			aPixData[iPix + 1] = Math.min(255, Math.max(0, color.g | 0));
			aPixData[iPix + 2] = Math.min(255, Math.max(0, color.b | 0));
			aPixData[iPix + 3] = Math.min(255, Math.max(0, color.a | 0));
			if (++x >= W) {
				++y;
				x = 0;
			}
		}
		oCtx.putImageData(oImgData, 0, 0);
	}
	
	/**
	 * Loads an image and converts it in a canvas
	 * @param sUrl {string} image url
	 * @return {Promise<HTMLCanvasElement>}
	 */
	static loadCanvas(sUrl) {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.addEventListener('load', () => {
				resolve(CanvasHelper.cloneCanvas(image));
			});
			image.addEventListener('error', () => {
				reject(new Error('CanvasHelper.loadImage : Error while loading this image : "' + sUrl + '"'));
			});
			image.src = sUrl;
		});
	}

	static resize(oCanvas, width, height) {
		const oNewCanvas = this.createCanvas(width, height);
		CanvasHelper.setImageSmoothing(oNewCanvas, CanvasHelper.getImageSmoothing(oCanvas));
		const ctx = oNewCanvas.getContext('2d');
		ctx.drawImage(oCanvas, 0, 0, oCanvas.width, oCanvas.height, 0, 0, oNewCanvas.width, oNewCanvas.height);
		return oNewCanvas;
	}
}

export default CanvasHelper;
