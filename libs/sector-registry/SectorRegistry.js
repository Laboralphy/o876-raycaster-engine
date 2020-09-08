/**
 * @class SectorRegistry
 * The SectorRegistry registers object withing a sectorized grid
 * it helps process entiteis among others witin a limited region of 2d space
 */

import Grid from '@laboralphy/grid';
import Sector from './Sector';

class SectorRegistry {
    constructor() {
        const g = new Grid();
        g.on('rebuild', function(data) {
            let oSector = new Sector();
            oSector.x = data.x;
            oSector.y = data.y;
            data.cell = oSector;
        });
        this._cellWidth = 0;
        this._cellHeight = 0;
        this._grid = g;
    }

    setCellWidth(w) {
        this._cellWidth = w;
        return this;
    }

    setCellHeight(h) {
        this._cellHeight = h;
        return this;
    }

    getCellWidth() {
        return this._cellWidth;
    }

    getCellHeight() {
        return this._cellHeight;
    }

    get grid() {
        return this._grid;
    }

    /**
     * Return the sector corresponding to the given coordinates
     * if the parameters are number, the real sector indices are used (0, 1, 2...)
     * if the parameter is a Vector, its components are int-divided by cell size before application
     * @param x {number} position x
     * @param y {number|undefined} position y
     * @return {*}
     */
    sector(x, y = undefined) {
        if (y === undefined) {
            return this._grid.cell(x.x / this._cellWidth | 0, x.y / this._cellHeight | 0);
        } else {
            return this._grid.cell(x, y);
        }
    }
}

export default SectorRegistry;