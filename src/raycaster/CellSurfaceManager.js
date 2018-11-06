import ShadedTileSet from './ShadedTileSet';


/**
 * this class allows to add some properties to each surface of a 2-dimensional array of cells
 */
class CellSurfaceManager {
    constructor() {
        this._map = null;
        this._width = 0;
        this._height = 0;
        this._wBlock = 0;
        this._hBlock = 0;
    }

    /**
     * Defines the meta map size
     * @param w {number} new width
     * @param h {number} new height
     */
    setMapSize(w, h) {
        this._map = [];
        let aBlock, aRow, x, y, nSide;
        this._width = w;
        this._height = h;
        for (y = 0; y < h; ++y) {
            aRow = [];
            for (x = 0; x < w; ++x) {
                aBlock = [];
                for (nSide = 0; nSide < 6; ++nSide) {
                    aBlock.push({
                        x,
                        y,
                        tileset: null,
                        diffuse: 0,
                        imageData: null,  // these are for the flat textures
                        imageData32: null
                    });
                }
                aRow.push(aBlock);
            }
            this._map.push(aRow);
        }
    }

    /**
     * retrieves data corresponding to the surface of the cell with matching coordinate
     * @param x {number} cell coordinates
     * @param y {number} cell coordinates
     * @param nSide {number} wall index (0 - 5)
     * @returns {*}
     */
    getSurface(x, y, nSide) {
        if (x < 0 || y < 0) {
            throw new Error('x or y out of bound ' + x + ', ' + y);
        }
        return this._map[y][x][nSide];
    }

    /**
     * sets data corresponding to the surface of the cell with matching coordinate
     * @param x {number} cell coordinates
     * @param y {number} cell coordinates
     * @param nSide {number} wall index (0 - 5)
     * @param xValue {*}
     */
    setSurface(x, y, nSide, xValue) {
        this._map[y][x][nSide] = xValue;
    }

    /**
     * Rotates all wall surfaces of a cell.
     * case 1 : wall-surface 0 becomes 3, wall-surface 1 becomes 0, wall-surface 2 becomes 1...
     * case 2 : wall-surface 0 becomes 1, wall-surface 1 becomes 2, wall-surface 2 becomes 3...
     * This mechanism is use to create a hidden texture, and show it when needed without redrawing it
     * (because redrawing additional texture takes time)
     * @param x {number} cell coordinates
     * @param y {number} cell coordinates
     * @param bClockwise {boolean} true = clockwise, false = counter clockwise... or not
     * true : 0 devient 3, 1 devient 0...
     * false : 0 devient 1, 1 devient 2, 2 devient 3, 3 devient 0
     */
    rotateWallSurfaces(x, y, bClockwise) {
        let mxy = this._map[y][x];
        let a = mxy
            .slice(0, 4)
            .map(m => m.tileset);
        if (bClockwise) {
            a.push(a.shift());
        } else {
            a.unshift(a.pop());
        }
        a.forEach((m, i) => {
            mxy[i].tileset = m;
        });
    }

    /**
     * defines the size of a block
     * @param w
     * @param h
     */
    setBlockSize(w, h) {
        this._hBlock = h;
        this._wBlock = w;
    }

    /**
     * defines a new tile for the surface
     * the tile, is just a canvas with appropriate dimension
     * the cell surface manager will do the shading automatically
     * @param x {number} cell coordinate
     * @param y {number} cell coordinate
     * @param nSide {number} wall side index
     * @param oTile {HTMLCanvasElement} the new surface
     */
    setSurfaceTile(x, y, nSide, oTile) {
        let oSurface = this.getSurface(x, y, nSide);
        // in case of flat texture
        oSurface.imageData = null;
        oSurface.imageData32 = null;
        const ts = new ShadedTileSet();
        oSurface.tileset = ts;
        ts.setImage(oTile, oTile.width, oTile.height);
    }

    removeClone(x, y, nSide) {
        this.getSurface(x, y, nSide).tileset = null;
    }

    shadeSurface(x, y, nSide, nShades, sFogColor, sFilter, fBrightness) {
        const oSurface = this.getSurface(x, y, nSide);
        const ts = oSurface.tileset;
        if (ts) {
            ts.setShadingLayerCount(nShades);
            ts.compute(sFogColor, sFilter, fBrightness);
            if (nSide >= 4) {
                const oCvs = ts.getImage();
                const oCtx = oCvs.getContext('2d');
                const oImgData = oCtx.getImageData(0, 0, oCvs.width, oCvs.height);
                oSurface.imageData = oImgData;
                oSurface.imageData32 = new Uint32Array(oImgData.data.buffer);
            }
        }
    }

    /**
     * recompute all surfaces if the shading parameters have changed
     */
    shadeAllSurfaces(nShades, sFogColor, sFilter, fBrightness) {
        const ymax = this._height;
        const xmax = this._width;
        for (let y = 0; y < ymax; ++y) {
            for (let x = 0; x < xmax; ++x) {
                for (let nSide = 0; nSide < 6; ++nSide) {
                    this.shadeSurface(x, y, nSide, nShades, sFogColor, sFilter, fBrightness);
                }
            }
        }
    }
}

export default CellSurfaceManager;
