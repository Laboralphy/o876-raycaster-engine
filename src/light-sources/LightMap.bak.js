import MarkerRegistry from "../marker-registry/MarkerRegistry";
import Bresenham from "../bresenham";
import Grid from "../grid/Grid";
import GeometryHelper from "../geometry/GeometryHelper";
import {linear} from "../interpolator";
// import CanvasHelper from "../canvas-helper/CanvasHelper";
import Reactor from "../object-helper/Reactor";

class LightMap {
    constructor() {
        this._cc = new MarkerRegistry();
        this._lb = new MarkerRegistry();
        this._gu = new MarkerRegistry();
        this._grid = new Grid();
        this._sources = [];
        this._invalid = true;
        this._lastId = 0;
    }

    invalidate(id) {
        this._sources.find(s => s.id === id).i = true;
        this._invalid = true;
    }

    /**
     * returns the invalid flag value
     * @returns {boolean}
     */
    isInvalid() {
        return this._invalid;
    }

    /**
     * Set the size of the light map
     * @param w {number} number of cells (x axis)
     * @param h {number} number of cells (y axis)
     */
    setSize(w, h) {
        this._grid.setWidth(w);
        this._grid.setHeight(h);
        this._grid.iterate((x, y, n) => ({}));
    }

    /**
     * Defines a light blocking region.
     * ...Or undefines a previously defined one
     * @param x {number} region corner coordinate x axis
     * @param y {number} region corner coordinate y axis
     * @param w {number} region width
     * @param h {number} region height
     * @param b {boolean} true = light blocking, false = light non-blocking
     */
    setLightBlocking(x, y, w, h, b) {
        for (let yi = 0; yi < h; ++yi) {
            for (let xi = 0; xi < w; ++xi) {
                if (b) {
                    this._lb.mark(x + xi, y + yi);
                } else {
                    this._lb.unmark(x + xi, y + yi);
                }
            }
        }
    }

    /**
     * coputes the resulting alpha, out of two overlaping alpha
     * @param a {number} first alpha value (0..1)
     * @param b {number} second alpha value (0..1)
     * @returns {number}
     */
    static alphaSum(a, b) {
        return Math.max(0, Math.min(1, a + b * (1 - a)));
    }

    updateSourceIntensity(x, y, value, id) {
        const g = this._grid;
        const c = g.cell(x, y);
        if (value > 0) {
            c[id] = value;
        } else {
            delete c[id];
        }
        this._gu.mark(x, y);
    }

    /**
     * traces a line from the source center to the source edge, stops if the line encounter a light blocking region
     * @param x0 {number} starting point x axis
     * @param y0 {number} starting point y axis
     * @param x1 {number} ending point x axis
     * @param y1 {number} ending point y axis
     * @param r0 {number} radius at full intensity
     * @param r1 {number} radius at zero intensity (the intensity between r0 and r1 is linear-interpolated)
     * @param intensity {number} default intensity
     */
    traceLineOfLight(x0, y0, x1, y1, r0, r1, intensity, oSource) {
        const cc = this._cc;
        const lb = this._lb;
        const g = this._grid;
        const id = oSource.id;
        const cells = oSource.c;
        Bresenham.line(x0, y0, x1, y1, (x, y, n) => {
            if (cc.isMarked(x, y)) {
                // already computed
                return true;
            }
            if (lb.isMarked(x, y)) {
                // light blocked : abort
                return false;
            }
            const dist = GeometryHelper.distance(x0, y0, x, y);
            let result = 0;
            if (dist <= r0) {
                // full intensity
                result = intensity;
            } else if (dist > r1) {
                // zero intensity
                result = 0;
            } else {
                // intensity = linearInterpolation(r0, r1, dist, 1, 0)
                result = linear(dist, r0, intensity, r1, 0);
            }
            // marker le point
            cc.mark(x, y);
            this.updateSourceIntensity(x, y, result, id);
            cells.push(x, y, result);
        });
    }

    /**
     * draws a light source
     * @param x {number} center of source x axis
     * @param y {number} center of source y axis
     * @param r0 {number} radius at full intensity
     * @param r1 {number} radius at zero intensity
     * @param intensity {number} intensity of the light source
     */
    traceLightSource(oSource) {
        const {x, y, r0, r1, intensity} = oSource.s;
        const id = oSource.id;
        const cells = oSource.c;
        this._cc.clear();
        const x0 = x - r1;
        const y0 = y - r1;
        const x9 = x + r1;
        const y9 = y + r1;
        for (let i = 0; i < (r1 << 1) + 1; ++i) {
            this.traceLineOfLight(x, y, x0 + i, y0, r0, r1, intensity, oSource);
            this.traceLineOfLight(x, y, x0, y0 + i, r0, r1, intensity, oSource);
            this.traceLineOfLight(x, y, x0 + i, y9, r0, r1, intensity, oSource);
            this.traceLineOfLight(x, y, x9, y0 + i, r0, r1, intensity, oSource);
        }
    }

    removeLightSource(oSource) {
        const cells = oSource.cells;
        const id = oSource.id;
        const g = this._grid;
        for (let i = 0, l = cells.length; i < l; i += 2) {
            let x = cells[i];
            let y = cells[i + 1];
            let c = g.cell(x, y);
            delete c[id];
        }
    }

    /**
     * draws all light sources, reseting entirely the grid
     */
    traceAllSources() {
        console.time('lightmap-trace');
        this._gu.clear();
        this
            ._sources
            .filter(oSource => oSource.i)
            .forEach(oSource => {
                this.removeLightSource(oSource);
                this.traceLightSource(oSource);
            });
        console.timeEnd('lightmap-trace');
    }

    /**
     * adds a source to the collection
     * @param x {number} center of source x axis
     * @param y {number} center of source y axis
     * @param r0 {number} radius at full intensity
     * @param r1 {number} radius at zero intensity
     * @param intensity {number} intensity of the light source
     * @returns {{x: *, y: *, r0: *, r1: *, intensity: *}}
     */
    addSource({x, y, r0, r1, intensity}) {
        const s = {x, y, r0, r1, intensity};
        const r = new Reactor(s);
        const id = ++this._lastId;
        this._sources.push({
            s, // the source metrics (center, radius...)
            r, // the reactor object
            id,  // the identifier
            c: [],  // a list of cell intensities
            i: true, // an invalid flag
            dead: false // a dead flag
        });
        this.invalidate(id);
        r.events.on('changed', ({key, root}) => this.invalidate(id));
        return s;
    }

    /**
     * get a previously defined light source.
     * the returned objet is reactive : changing its property will invalidate the LightMap instance state thus
     * re-computing all light sources
     * @param n {number} index of sources
     * @returns {{x: *, y: *, r0: *, r1: *, intensity: *}}
     */
    getSource(n) {
        return this._sources[n].s;
    }

    /**
     * removes a light source, previously added with add light source
     * the object returns by addLightsource is to be specified
     * @param oSource
     */
    removeSource(oSource) {
        oSource.dead = true;
    }


    /**
     * This function will transmit all intensity values from the internal grid to another virtual grid having this size : (gdw, gdh)
     * The parameter function "f" will be call for each cell within the (gdw, gdh) range
     * @param gdw {number} size of the resulting grid
     * @param gdh {number} size of the resulting grid
     * @param f [function) f(x, y, intensity) the resulting intensity at the resulting cell coordinates
     */
    filter(gdw, gdh, f) {
        const g = this._grid;
        const xr = g.getWidth() / gdw;
        const yr = g.getHeight() / gdh;
        let n = 0, i = 0;
        this._gu.iterate((x, y) => {
            for (let yi0 = 0; yi0 < yr; ++yi0) {
                for (let xi0 = 0; xi0 < xr; ++xi0) {
                    n += g.cell(x * xr + xi0 | 0, y * yr + yi0 | 0);
                    ++i;
                }
            }
            n /= i;
            f(x, y, n);
        });
    }

    clip(x0, y0, x1, y1) {
        let xmin = Math.min(x0, x1);
        let xmax = Math.max(x0, x1);
        let ymin = Math.min(y0, y1);
        let ymax = Math.max(y0, y1);
        this._clip = {
            x: xmin,
            y: ymin,
            width: xmax - ymin + 1,
            height: ymax - ymin + 1
        };
    }


    // /**
    //  * TODO to be remove if this tool is used with webworker
    //  * @returns {HTMLCanvasElement}
    //  */
    // toCanvas() {
    //     const g = this._grid;
    //     const w = g.getWidth();
    //     const h = g.getHeight();
    //     const c = CanvasHelper.createCanvas(w, h);
    //     CanvasHelper.applyFilter(c, (x, y, color) => {
    //         if (this._lb.isMarked(x, y)) {
    //             color.r = 255;
    //             color.g = 0;
    //             color.b = 0;
    //             color.a = 255;
    //         } else {
    //             const value = g.cell(x, y) * 255 | 0;
    //             color.r = value;
    //             color.g = value;
    //             color.b = value;
    //             color.a = 255;
    //         }
    //     });
    //     return c;
    // }

}

export default LightMap;