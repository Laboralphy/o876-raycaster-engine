import CanvasHelper from './CanvasHelper';


/**
 * this class allows to add some properties to a 2-dimensional array in order to extend the basic definition of cells
 * in the raycaster map.
 */

class MetaMap {
    constructor() {
        this._map = null;
        this._width = 0;
        this._height = 0;
        this._wBlock = 0;
        this._hBlock = 0;
        this._shadeFactor = 0;
    }

    /**
     * Defines the meta map size
     * @param w {number} new width
     * @param h {number} new height
     */
    setSize(w, h) {
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
                        surface: null,
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
     * retrieves data corresponding to the wall of the cell with matching coordinate
     * @param x {number} cell coordinates
     * @param y {number} cell coordinates
     * @param nSide {number} wall index (0 - 5)
     * @returns {*}
     */
    get(x, y, nSide) {
        if (x < 0 || y < 0) {
            throw new Error('x or y out of bound ' + x + ', ' + y);
        }
        return this._map[y][x][nSide];
    }

    /**
     * sets data corresponding to the wall of the cell with matching coordinate
     * @param x {number} cell coordinates
     * @param y {number} cell coordinates
     * @param nSide {number} wall index (0 - 5)
     * @param xValue {*}
     */
    set(x, y, nSide, xValue) {
        this._map[y][x][nSide] = xValue;
    }

    /**
     * Permet de faire tourner les textures additionnel générée avec cloneTexture
     * Cela permet d'avoir 4 états de textures aditionnelle
     * Par exemple on peut créer une texture additionnelle et la camoufler par
     * rotation puis la faire réapparaitre.
     * Cette opération est plus rapide que de tout redessiner
     * @param x coordonnée bloc à tourner
     * @param y
     * @param n sens de rotation true ou false
     * true : 0 devient 3, 1 devient 0...
     * false : 0 devient 1, 1 devient 2, 2 devient 3, 3 devient 0
     */
    rotateWallSurfaces(x, y, n) {
        let mxy = this._map[y][x];
        let a = mxy
            .slice(0, 4)
            .map(m => m.surface);
        if (n) {
            a.push(a.shift());
        } else {
            a.unshift(a.pop());
        }
        a.forEach((m, i) => {
            mxy[i].surface = m;
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
     * create a copy of the texture of the specified wall.
     * returns the newly made canvas (so we can draw things on it).
     * @param oTextures {*} wall textures
     * @param iTexture {number} wall texture index
     * @param x {number} cell coordinate
     * @param y {number} cell coordinate
     * @param nSide {number} wall side index
     * @return {HTMLCanvasElement}
     */
    cloneTexture(oTextures, iTexture, x, y, nSide) {
        let oCanvas;
        let oBlock = this.get(x, y, nSide);
        let w = this._wBlock;
        let h;
        if (nSide < 4) {
            // wall texture
            h = this._hBlock;
        } else {
            // flat texture
            h = w;
            oBlock.imageData = null;
            oBlock.imageData32 = null;
        }
        if (oBlock.surface === null) {
            oBlock.surface = oCanvas = CanvasHelper.createCanvas(w, h);
        } else {
            oCanvas = oBlock.surface;
        }
        oCanvas.getContext('2d').drawImage(oTextures, iTexture * w, 0, w, h, 0, 0, w, h);
        return oCanvas;
    }

    removeClone(x, y, nSide) {
        this.get(x, y, nSide).surface = null;
    }
}

export default MetaMap;
