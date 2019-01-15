import Grid from "../grid/Grid";

class LightSource {
    constructor() {
        this._radius0 = 0;
        this._radius1 = 0;
        this._x = 0;
        this._y = 0;
        this._planeSpacing = 64;
        this._cellSize = 8; // nombre de case illumination dans une cellule
        this._grid = 0;
    }

    _createGrid() {
        const g = new Grid();
        const r1 = this._radius1;
        const ps = this._planeSpacing;
        const cs = this._cellSize;
        const wCS = 2 * cs * r1 / ps + 1 | 0; // unit : cs
        g.setWidth(wCS);
        g.setHeight(wCS);
        this._grid = g;
        this._xCenterCS = wCS;
        this._yCenterCS = wCS;
        // cellule -1 = obstrué
    }

    /**
     * Converts lightmap XY to labyrinth XY Cell
     * @param x
     * @param y
     * @private
     */
    _convertGridXYToMapXY(x, y) {
        const xRef = this._x - this._radius1; // unit : ps
        // x doit êter de la même unité que planespacing
        // ex:  si ps = 64, et x = 588, et cs = 8 alors xr =
        // x = xCenter alors return
        // si la source lum est à x = 192 et un rayon de 100 alors le coin gauche est en
        // rayon 100 -> cell 100 / 64 * 8
        //x =
    }
}

export default LightSource;