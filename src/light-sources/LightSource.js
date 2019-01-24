import Reactor from "../object-helper/Reactor";
import MarkerRegistry from "../marker-registry/MarkerRegistry";
import Bresenham from "../bresenham";
import GeometryHelper from "../geometry/GeometryHelper";
import {linear} from "../interpolator";

let LAST_ID = 0;

class LightSource {
    constructor() {
        this._metrics = {
            x: 0,
            y: 0,
            r0: 0,
            r1: 0,
            v: 0
        };
        this._reactor = new Reactor(this._metrics);
        this._reactor.events.on('changed', () => this.invalidate());
        this._id = ++LAST_ID;
        this._cc = new MarkerRegistry(); // the cache
        this._livePixels = new MarkerRegistry(); // stores what pixel has been recently lit
        this._deadPixels = new MarkerRegistry(); // pixels that have not been recently lit
        this._invalid = true;
    }

    invalidate() {
        this._invalid = true;
    }

    isInvalid() {
        return this._invalid;
    }

    clearInvalidFlag() {
        this._invalid = false;
    }

    get metrics() {
        return this._metrics;
    }

    get id() {
        return this._id;
    }

    on(...args) {
        return this._reactor.events.on(...args);
    }

    resetCache() {
        this._cc.clear();
        this._deadPixels = this._livePixels;
        this._livePixels = new MarkerRegistry;
    }

    lightPixel(x, y) {
        this._deadPixels.unmark(x, y);
        this._livePixels.mark(x, y);
    }
}

export default LightSource;