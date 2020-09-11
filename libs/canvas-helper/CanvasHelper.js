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
		c.getContext('2d').imageSmoothingQuality = 'low';
		CanvasHelper.setImageSmoothing(c, bDefaultImageSmoothing);
		return c;
	}

	static setDefaultImageSmoothing(b) {
		console.info('set default image smoothing to', b);
		console.trace()
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
		CanvasHelper.setImageSmoothing(c, b);
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

	/**
	 * resize a canvas
	 *
	 * @param oCanvas
	 * @param width
	 * @param height
	 * @return {HTMLCanvasElement}
	 */
	static resize(oCanvas, width, height) {
		const oNewCanvas = this.createCanvas(width, height);
		CanvasHelper.setImageSmoothing(oNewCanvas, CanvasHelper.getImageSmoothing(oCanvas));
		const ctx = oNewCanvas.getContext('2d');
		ctx.drawImage(oCanvas, 0, 0, oCanvas.width, oCanvas.height, 0, 0, oNewCanvas.width, oNewCanvas.height);
		return oNewCanvas;
	}


	/**
	 * Draw a multiline text in a canvas
	 * @example text(canvas, text, x, y, {stroke: true}, 250, 16)
	 * will draw text using fillStyle and strokeStyle properties (at current values)
	 *
	 * @example text(canvas, text, x, y, {fill: false, stroke: 'red'}, 250, 16)
	 * will draw text using ONLY "red" strokeStyle property
	 *
	 * @param oCanvas
	 * @param sText
	 * @param x
	 * @param y
	 * @param oStyles
	 * @param wMax
	 * @param h
	 */
	static text(oCanvas, sText, x, y, oStyles, wMax, h) {
		// white space as a cesure
		const CESURE = ' ';
		// specified gradient or plain string in styles ?
		const bGradient = oStyles instanceof CanvasGradient;
		// specified an object with multiple properties ?
		const bObject = !bGradient && (oStyles !== null && (typeof oStyles === 'object'));
		const oContext = oCanvas.getContext("2d");
		// for gradient and plain styles : fill style only
		if (oStyles instanceof CanvasGradient || typeof oStyles === 'string') {
			oContext.fillStyle = oStyles;
		}
		// multiple style properties
		let bFill = true; // if true : we will use fillText
		let bStroke = false; // if true : we will use strokeText

		if (bObject && ('fill' in oStyles)) {
			if (oStyles.fill === false) {
				// if oStyle.fill is false, we cancel default value : no text will be filled
				bFill = false;
			} else {
				oContext.fillStyle = oStyles.fill;
			}
		}
		if (bObject && ('stroke' in oStyles)) {
			if (oStyles.stroke === true) {
				// if oStyle.stroke is true, we cancel default value : text will be stroke
				bStroke = true;
			} else {
				bStroke = true;
				oContext.fillStyle = oStyles.stroke;
			}
			// if oStyle.stroke is false, we keep default false value : text will not be stroke
		}
		if (bObject && ('font' in oStyles)) {
			oContext.font = oStyles.font;
		}

		const aText = sText
			.replace(/\n/g, '\n ')
			.split(CESURE)
			.filter(s => s.length > 0);
		let xCurs = 0, yCurs = 0;
		let aLine = [];

		const commitText = () => {
			const sLine = aLine.join('');
			if (bStroke) {
				oContext.strokeText(sLine, x + xCurs, y + yCurs, wMax);
			}
			if (bFill) {
				oContext.fillText(sLine, x, y + yCurs, wMax);
			}
			xCurs = 0;
			yCurs += h;
			aLine = [];
		};
		while (aText.length) {
			const sWord = aText.shift() + CESURE;
			const mt = oContext.measureText(sWord);
			if (sWord.endsWith('\n') || (xCurs + mt.width) > wMax) {
				commitText();
			} else {
				xCurs += mt.width;
			}
			aLine.push(sWord);
		}
		commitText();
	}
}

export default CanvasHelper;
