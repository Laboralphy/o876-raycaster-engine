/**
 * @class Grid
 * This class is a generic grid containing anything
 * When new items are needed (when the grid changes size and gets larger)
 * an event is fired : "rebuild" which can be handled to construct cell content.
 */
import Events from 'events';

class Grid {
	constructor() {
        this._cells = null;
        this._width = 0;
        this._height = 0;
        this.emitter = new Events();
	}

    on() { this.emitter.on(...arguments); return this; }
    off() { this.emitter.off(...arguments); return this; }
    one() { this.emitter.once(...arguments); return this; }
    trigger() { this.emitter.emit(...arguments); return this; }


    /**
	 * Setter/Getter for a dimensionnal array of cells, wich represents the grid content.
     * @param (x) {array}
     * @return {Grid|array}
     */
	setCells(x) {
        if (x !== undefined) {
            this._height = x.length;
            if (this._height) {
            	this._width = x[0].length;
			} else {
                this._width = 0;
			}
        }
		this._cells = x;
        return this;
	}

	getCells() {
		return this._cells;
	}

	iterate(f) {
        const w = this.getWidth();
        const h = this.getHeight();
		for (let y = 0; y < h; ++y) {
			for (let x = 0; x < w; ++x) {
				this.cell(x, y, f(x, y, this.cell(x, y)));
			}
		}
	}

	clipAxis(nStart, nRegionWidth, nGridWidth) {
		const nEnd = nStart + nRegionWidth - 1;
        if (nEnd < 0 && nStart < 0) {
            return false;
        }
        if (nEnd >= nGridWidth && nStart >= nGridWidth) {
            return false;
        }
        if (nStart < 0 && nEnd >= nGridWidth) {
        	return {n: 0, w: nGridWidth};
		}
		let n = nStart;
        let w = nRegionWidth;
		if (n < 0) {
			w += n;
			n = 0;
		}
		if ((n + w) > nGridWidth) {
			w = nGridWidth - n;
		}
		return {n, w};
	}

	getRegion(xRegion, yRegion, wRegion, hRegion) {
        const wGrid = this.getWidth();
        const hGrid = this.getHeight();
        const xClip = this.clipAxis(xRegion, wRegion, wGrid);
        const yClip = this.clipAxis(yRegion, hRegion, hGrid);
        if (xClip === false || yClip === false) {
        	return false;
		}
		return {
        	x: xClip.n,
			y: yClip.n,
			w: xClip.w,
			h: yClip.w
		};
	}

	iterateRegion(xRegion, yRegion, wRegion, hRegion, f) {
		const {x, y, w, h} = this.getRegion(xRegion, yRegion, wRegion, hRegion);
        for (let yi = 0; yi < h; ++yi) {
        	let ym = y + yi;
            for (let xi = 0; xi < w; ++xi) {
                let xm = x + xi;
                this.cell(xm, ym, f(xm, ym, this.cell(xm, ym)));
            }
        }
	}

    /**
     * Setter/Getter for the grid width.
	 * setting a new width will rebuild the grid
     * @param (w) {number}
     * @return {Grid|number}
     */
    setWidth(w) {
		this._rebuild(w, this._height);
        this._width = w;
        return this;
    }

    getWidth() {
        return this._width;
    }

    /**
     * Setter/Getter for the grid height.
     * setting a new height will rebuild the grid
     * @param (h) {number}
     * @return {Grid|number}
     */
    setHeight(h) {
        this._rebuild(this._width, h);
        this._height = h;
        return this;
    }

    getHeight() {
        return this._height;
	}

    /**
	 * Rebuilds the grid according to the given dimensions
	 * @param w {number}
	 * @param h {number}
	 * @private
	 * @return {array}
	 */
	_rebuild(w, h) {
		let g = [];
		let x, y, aRow, data;
		for (y = 0; y < h; y++) {
			aRow = [];
			for (x = 0; x < w; x++) {
				data = {x: x, y: y, width: w, height: h, cell: null};
				this.trigger('rebuild', data);
				aRow.push(data.cell);
			}
			g.push(aRow);
		}
		this._width = w;
		this._height = h;
		this.setCells(g);
	}

    /**
	 * Sets/Gets a cell value given its coordinates
     * @param x {number}
     * @param y {number}
     * @param (v) {*}
     * @return {*}
     */
	cell(x, y, v) {
		if (v === undefined) {
			if (y >= 0 && y >= 0 && y < this._height && x < this._width) {
				return this._cells[y][x];
			} else {
				return null;
			}
		} else {
			if (y >= 0 && y >= 0 && y < this._height && x < this._width) {
				this._cells[y][x] = v;
			}
			return this;
		}
	}
}

export default Grid;