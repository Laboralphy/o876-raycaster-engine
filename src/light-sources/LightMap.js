import MarkerRegistry from "../marker-registry/MarkerRegistry";
import Bresenham from "../bresenham";
import Grid from "../grid/Grid";
import GeometryHelper from "../geometry/GeometryHelper";
import {linear} from "../interpolator";
import CanvasHelper from "../canvas-helper/CanvasHelper";
import Reactor from "../object-helper/Reactor";

class LightMap {
    constructor() {
        this._cc = new MarkerRegistry();
        this._lb = new MarkerRegistry();
        this._grid = new Grid();
        this._sources = [];
        this._invalid = true;
    }

    /**
     * Turns the "invalidate" flag to true
     */
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

    /**
     * Set the size of the light map
     * @param w {number} number of cells (x axis)
     * @param h {number} number of cells (y axis)
     */
    setSize(w, h) {
        this._grid.setWidth(w);
        this._grid.setHeight(h);
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
        this._invalid = true;
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
    traceLineOfLight(x0, y0, x1, y1, r0, r1, intensity) {
        const cc = this._cc;
        const lb = this._lb;
        const g = this._grid;
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
            g.cell(x, y, LightMap.alphaSum(g.cell(x, y), result));
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
    traceLightSource(x, y, r0, r1, intensity) {
        this._cc.clear();
        const x0 = x - r1;
        const y0 = y - r1;
        const x9 = x + r1;
        const y9 = y + r1;
        for (let i = 0; i < (r1 << 1) + 1; ++i) {
            this.traceLineOfLight(x, y, x0 + i, y0, r0, r1, intensity);
            this.traceLineOfLight(x, y, x0, y0 + i, r0, r1, intensity);
            this.traceLineOfLight(x, y, x0 + i, y9, r0, r1, intensity);
            this.traceLineOfLight(x, y, x9, y0 + i, r0, r1, intensity);
        }
    }

    /**
     * draws all light sources
     */
    traceAllSources() {
        if (this._invalid) {
            this._grid.iterate((x, y, n) => 0);
            this._sources.forEach(({s}) => {
                this.traceLightSource(s.x, s.y, s.r0, s.r1, s.intensity);
            });
        }
        this._invalid = false;
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
        this._sources.push({
            s, r
        });
        r.events.on('changed', () => this._invalid = true);
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

    filter(gdw, gdh, f) {
        const g = this._grid;
        const xr = g.getWidth() / gdw;
        const yr = g.getHeight() / gdh;
        for (let yi = 0; yi < gdh; ++yi) {
            for (let xi = 0; xi < gdw; ++xi) {
                let n = 0, i = 0;
                for (let yi0 = 0; yi0 < yr; ++yi0) {
                    for (let xi0 = 0; xi0 < xr; ++xi0) {
                        n += g.cell(xi * xr + xi0 | 0, yi * yr + yi0 | 0);
                        ++i;
                    }
                }
                n /= i;
                f(xi, yi, n);
            }
        }
    }

    toCanvas() {
        const g = this._grid;
        const w = g.getWidth();
        const h = g.getHeight();
        const c = CanvasHelper.createCanvas(w, h);
        CanvasHelper.applyFilter(c, (x, y, color) => {
            if (this._lb.isMarked(x, y)) {
                color.r = 255;
                color.g = 0;
                color.b = 0;
                color.a = 255;
            } else {
                const value = g.cell(x, y) * 255 | 0;
                color.r = value;
                color.g = value;
                color.b = value;
                color.a = 255;
            }
        });
        return c;
    }

}

export default LightMap;