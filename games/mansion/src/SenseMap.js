import LightMap from "libs/light-sources/LightMap";
import Grid from "@laboralphy/grid";
import * as CONSTS from './consts';

class SenseMap {
    constructor() {
        this._lightMap = null;
        this._lightSources = null;
        this._grid = null;
        this._size = 0;
    }

    /**
     * Remplace la grille de light map par une nouvelle
     * @param nSize
     */
    init(nSize) {
        this._lightMap = new LightMap();
        this._lightMap.setSize(nSize << 1, nSize << 1);
        this._lightSources = {};
        this._grid = new Grid();
        this._size = nSize;
    }

    /**
     * Ajoute une source
     * @param x
     * @param y
     */
    addSense(ref, x, y) {
        if (ref in this._lightSources) {
            throw new Error('reference ' + ref + ' is already used in sens light map');
        }
        this._lightSources[ref] = this._lightMap.addSource(x, y, 1, CONSTS.PLAYER_SENSE_DISTANCE, 1);
    }

    /**
     * Supprime une source
     * @param x
     * @param y
     */
    removeSense(ref) {
        const lsFound = this._lightSources[ref];
        if (lsFound) {
            this._lightMap.removeSource(lsFound);
            this.computeMap();
        }
    }

    computeMap() {
        this._grid.width = this._size;
        this._grid.height = this._size;
        this._lightMap.traceAllSources();
        this._lightMap.filter((x, y, n) => {
            this._grid.cell(x, y, n);
        });
    }

    getSenseAt(x, y) {
        return this._grid.cell(x >> 1, y >> 1) || 0;
    }
}

export default SenseMap;