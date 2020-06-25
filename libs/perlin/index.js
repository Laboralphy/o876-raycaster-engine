class Perlin {

	/**
	 * for a given size, compute the best octave count
	 * @param n {number} size (pixel}
	 * @returns {number}
	 */
	static computeOptimalOctaves(n) {
		let i = 10;
		while (i > 0) {
			let i2 = 1 << i;
			if (i2 <= n) {
				break;
			}
			--i;
		}
		return i;
	}

	/**
	 * Cosine Interpolation
	 * @param x0 {number} minimum
	 * @param x1 {number} maximum
	 * @param mu {number} value between 0 and 1
	 * @return {number} float, interpolation result
	 */
	static cosineInterpolate(x0, x1, mu) {
		let mu2 = (1 - Math.cos(mu * Math.PI)) / 2;
   		return x0 * (1 - mu2) + x1 * mu2;
	}

	static generateSmoothNoise(aBaseNoise, nOctave) {
		let w = aBaseNoise.length;
		let h = aBaseNoise[0].length;
		let aSmoothNoise = new Array(h);
		let r;
		let nSamplePeriod = 1 << nOctave;
		let fSampleFreq = 1 / nSamplePeriod;
		let xs0, xs1, ys0, ys1;
		let hBlend, vBlend, fTop, fBottom;
		let interpolate = Perlin.cosineInterpolate;
		for (let x, y = 0; y < h; ++y) {
      		ys0 = y - (y % nSamplePeriod);
      		ys1 = (ys0 + nSamplePeriod) % h;
      		hBlend = (y - ys0) * fSampleFreq;
      		r = new Float32Array(w);
			let bny0 = aBaseNoise[ys0];
			let bny1 = aBaseNoise[ys1];
      		for (x = 0; x < w; ++ x) {
       			xs0 = x - (x % nSamplePeriod);
      			xs1 = (xs0 + nSamplePeriod) % w;
      			vBlend = (x - xs0) * fSampleFreq;
      			fTop = interpolate(bny0[xs0], bny1[xs0], hBlend);
      			fBottom = interpolate(bny0[xs1], bny1[xs1], hBlend);
     			r[x] = interpolate(fTop, fBottom, vBlend);
      		}
      		aSmoothNoise[y] = r;
		}
		return aSmoothNoise;
	}

	/**
	 *
	 * @param aBaseNoise {*} a 2d array of values
	 * @param nOctaveCount
	 * @returns {[]}
	 */
	static generate(aBaseNoise, nOctaveCount) {
		let w = aBaseNoise.length;
		let h = aBaseNoise[0].length;
		let aSmoothNoise = new Array(nOctaveCount);
		let fPersist = 0.5;

		for (let i = 0; i < nOctaveCount; ++i) {
			aSmoothNoise[i] = Perlin.generateSmoothNoise(aBaseNoise, i);
		}

		let aPerlinNoise = new Array(h);
		let fAmplitude = 1;
		let fTotalAmp = 0;
		let x, y, r;

		for (y = 0; y < h; ++y) {
			r = new Float32Array(w);
			for (x = 0; x < w; ++x) {
				r[x] = 0;
			}
			aPerlinNoise[y] = r;
		}

		for (let iOctave = nOctaveCount - 1; iOctave >= 0; --iOctave) {
			fAmplitude *= fPersist;
			fTotalAmp += fAmplitude;
			let sno = aSmoothNoise[iOctave];
			for (y = 0; y < h; ++y) {
				let snoy = sno[y];
				let pny = aPerlinNoise[y];
				for (x = 0; x < w; ++x) {
					pny[x] += snoy[x] * fAmplitude;
				}
			} 
		}
		for (y = 0; y < h; ++y) {
			let pny = aPerlinNoise[y];
			for (x = 0; x < w; ++x) {
				pny[x] /= fTotalAmp;
			}
		}
		return aPerlinNoise;
	}

	/**
	 * Applique une palette au bruit généré
	 * @param aNoise {Array} an array produced by generate()
	 * @param aPalette {array}
	 */
	static colorize(aNoise, aPalette) {
		let pl = aPalette.length;
		let data = [];
		aNoise.forEach(r => r.forEach(x => {
			let nColor = Math.min(pl - 1, x * pl | 0);
			data.push(aPalette[nColor]);
		}));
		return data;
	}

}

module.exports = Perlin;