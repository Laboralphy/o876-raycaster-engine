import MarkerRegistry from "../marker-registry/MarkerRegistry";
import Bresenham from "../bresenham";
import Grid from "@laboralphy/grid";
import Geometry from "../geometry";
import {linear} from "../interpolator";
import LightSource from "./LightSource";


const PIXEL_STATE_DEAD = 0;
const PIXEL_STATE_LIVE = 1;
const PIXEL_STATE_NEW = 2;

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

    invalidate() {
        this._invalid = true;
    }

    /**
     * returns the invalid flag value
     * @returns {boolean}
     */
    isInvalid() {
        return this._invalid;
    }

    clearInvalidFlag() {
        this._invalid = false;
    }

    /**
     * Set the size of the light map
     * @param w {number} number of cells (x axis)
     * @param h {number} number of cells (y axis)
     */
    setSize(w, h) {
        this._grid.width = w;
        this._grid.height = h;
        this._grid.iterate((x, y, n) => []);
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
        // we must list all sources that overlap this rectangular region
        let ii = 0;
        this._sources.filter(s => {
            const m = s.metrics;
            return Geometry.circleInRect(m.x, m.y, m.r1, x, y, w, h);
        }).forEach(s => {
            ++ii;
            this.invalidate();
            s.invalidate();
        });
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

    updatePixel(x, y, value, id) {
        const g = this._grid;
        const c = g.cell(x, y);
        // get the corresponding pixel for source id
        const p = c.find(gp => gp.id === id);
        if (p) {
            if (value !== p.v) {
                p.i = true;  // the pixel is invalid if the value changes
                p.v = value; // new value
                this._gu.mark(x & 0xFFFFFFFE, y & 0xFFFFFFFE);
            }
            p.s = PIXEL_STATE_LIVE
        } else {
            // no pixel : add a new pixel to the list
            c.push({
                v: value,
                i: true,
                id,
                s: PIXEL_STATE_NEW
            });
            this._gu.mark(x & 0xFFFFFFFE, y & 0xFFFFFFFE);
        }
    }

    removePixel(x, y, id) {
        const g = this._grid;
        const c = g.cell(x, y);
        // get the corresponding pixel for source id
        const p = c.find(gp => gp.id === id);
        if (p) {
            p.i = true;
            p.v = 0; // new value
            p.s = PIXEL_STATE_DEAD;
            this._gu.mark(x & 0xFFFFFFFE, y & 0xFFFFFFFE);
        }
    }

    /**
     * traces a line from the source center to the source edge, stops if the line encounter a light blocking region
     * @param x1 {number} ending point x axis
     * @param y1 {number} ending point y axis
     */
    traceLineOfLight(x1, y1, oSource) {
        const m = oSource.metrics;
        const x0 = m.x;
        const y0 = m.y;
        const id = oSource.id;
        const cc = oSource._cc;
        const lb = this._lb;
        const intensity = m.v;
        const r0 = m.r0;
        const r1 = m.r1;
        const g = this._grid;
        const xMax = g.width;
        const yMax = g.height;
        Bresenham.line(x0, y0, x1, y1, (x, y, n) => {
            if (x >= 0 && y >= 0 && x < xMax && y < yMax) {
                if (cc.isMarked(x, y)) {
                    // already computed
                    return true;
                }
                if (lb.isMarked(x, y)) {
                    // light blocked : abort
                    return false;
                }
                const dist = Geometry.distance(x0, y0, x, y);
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
                oSource.lightPixel(x, y);
                this.updatePixel(x, y, result, id);
            }
        });
    }

    /**
     * draws a light source
     */
    traceLightSource(oSource) {
        const {x, y, r1} = oSource.metrics;
        const id = oSource.id;
        oSource.resetCache();
        const x0 = x - r1;
        const y0 = y - r1;
        const x9 = x + r1;
        const y9 = y + r1;

        for (let i = 0; i < (r1 << 1) + 1; ++i) {
            this.traceLineOfLight(x0 + i, y0, oSource);
            this.traceLineOfLight(x0, y0 + i, oSource);
            this.traceLineOfLight(x0 + i, y9, oSource);
            this.traceLineOfLight(x9, y0 + i, oSource);
        }
        // remove dead pixels
        let iDead = 0;
        oSource._deadPixels.iterate((x, y) => {
            this.removePixel(x, y, id);
            ++iDead;
        });
    }

    /**
     * draws all light sources, reseting entirely the grid
     */
    traceAllSources() {
        this
            ._sources
            .filter(oSource => oSource.isInvalid())
            .forEach(oSource => {
                this.traceLightSource(oSource);
                oSource.clearInvalidFlag();
            });
        this.clearInvalidFlag();
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
    addSource(x, y, r0, r1, intensity) {
        const oSource = new LightSource();
        const m = oSource.metrics;
        m.x = x;
        m.y = y;
        m.r0 = r0;
        m.r1 = r1;
        m.v = intensity;
        this._sources.push(oSource);
        this.invalidate();
        oSource.on('changed', ({key, root}) => {
            this.invalidate();
        });
        return oSource;
    }

    /**
     * removes a light source, previously added with add light source
     * the object returns by addLightsource is to be specified
     * @param oSource
     */
    removeSource(oSource) {
        oSource.resetCache();
        const id = oSource.id;
        oSource._deadPixels.iterate((x, y) => {
            this.removePixel(x, y, id);
        });

        const n = this._sources.indexOf(oSource);
        if (n) {
            this._sources.splice(n, 1);
        }
        this.invalidate();
    }


    /**
     * This function will transmit all intensity values from the internal grid to another virtual grid having this size : (gdw, gdh)
     * The parameter function "f" will be call for each cell within the (gdw, gdh) range
     * @param f [function) f(x, y, intensity) the resulting intensity at the resulting cell coordinates
     */
    filter(f) {
        const g = this._grid;
        this._gu.iterate((x, y) => {
            let n = 0;
            for (let yi0 = 0; yi0 < 2; ++yi0) {
                for (let xi0 = 0; xi0 < 2; ++xi0) {
                    n += g
                        .cell(x + xi0, y + yi0)
                        .reduce((prev, curr) => curr.s > PIXEL_STATE_DEAD ? LightMap.alphaSum(prev, curr.v) : prev, 0);
                }
            }
            n /= 4;
            f(x >> 1, y >> 1, n);
        });
    }

    getPixelCount() {
        let s = 0;
        this._grid.iterate((x, y, a) => {
            s += a.length;
        });
        return s;
    }
}

export default LightMap;