/**
 * Cette class spécialisée dan sla mesure du ping et son rendu visuel fait les chose suivante
 * - enregistre des valeurs numériques
 * - dessine une courbe
 *
 * Le maximum des valeurs numériques peut varier dont le graphe doit s'adapter
 */

import o876 from '../../o876';

class PingMonitor {

	/**
	 * Initialisation de l'objet
	 * @param samples {number}
	 * @param width {number}
	 * @param height {number}
	 * @param threshold {number}
	 */
	constructor({width, height, threshold, colors}) {
		this._samples = [];
		this._threshold = threshold;
		for (let i = 0; i < width; ++i) {
			this._samples.push(0);
		}
		let spectrum1 = [];
		let spectrum2 = [];
		for (let i = 0; i < 16; ++i) {
			spectrum1.push((i << 4) | i);
			spectrum2.push(256 - ((i << 4) | i));
		}
		spectrum1 = o876.Rainbow.spectrum(colors.min, colors.threshold, 16);
		spectrum2 = o876.Rainbow.spectrum(colors.threshold, colors.max, 16);
		this._spectrum = spectrum1.concat(spectrum2);
		let canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		canvas.setAttribute('style', 'image-rendering: optimizeSpeed');
		let ctx = canvas.getContext('2d');
		ctx.font = '10px monospace';
		this._canvas = canvas;
	}

	/**
	 * Ajoute un échantillon
	 * limite le nombre d'échantillons pour ne pas dépasser le nombre initial
	 * @param n {number}
	 */
	sample(n) {
		this._samples.shift();
		this._samples.push(n);
	}

	/**
	 * Rendu sur le canvas
	 */
	render() {
		let canvas = this._canvas;
		let samples = this._samples;
		let thres = this._threshold;
		let thres2 = thres << 1;
		let ctx = canvas.getContext('2d');
		let w = canvas.width;
		let h = canvas.height;
		ctx.clearRect(0, 0, w, h);
		let yMax = samples.reduce((prev, x) => Math.max(prev, x), thres2);
		let avg = samples.reduce((prev, x) => x + prev, 0) / samples.length | 0;
		let y;
		const spectrum = this._spectrum;
		const spectrumLength = spectrum.length;
		const spectrumHalfLength = spectrumLength >> 1;
		let iSpectrum = 0;
		for (let x = 0, xMax = samples.length; x < xMax; ++x) {
			y = (samples[x] * h / yMax) | 0;
			if (samples[x] < thres) {
				iSpectrum = samples[x] * spectrumHalfLength / thres | 0;
			} else {
				iSpectrum = spectrumHalfLength + (samples[x] - thres) * spectrumHalfLength / thres | 0;
			}
			iSpectrum = Math.min(spectrumLength - 1, Math.max(0, iSpectrum));
			ctx.fillStyle = spectrum[iSpectrum];
			ctx.fillRect(x, h - y, 1, y);
		}
		ctx.fillStyle = 'white';
		ctx.strokeStyle = 'black';
		let text = avg.toString();
		ctx.strokeText(text, 0, 10);
		ctx.fillText(text, 0, 10);
		return canvas;
	}
}

export default PingMonitor;