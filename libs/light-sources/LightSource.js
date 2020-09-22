import Reactor from "../object-helper/Reactor";
import MarkerRegistry from "../marker-registry/MarkerRegistry";

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
    
    get state() {
        return {
            id: this._id,
            x: this._metrics.x,
            y: this._metrics.y,
            r0: this._metrics.r0,
            r1: this._metrics.r1,
            v: this._metrics.v
        };
    }

    set state({id, x, y, r0, r1, v}) {
        this._id = id;
        this._metrics.x = x;
        this._metrics.y = y;
        this._metrics.r0 = r0;
        this._metrics.r1 = r1;
        this._metrics.v = v;
        LAST_ID = Math.max(LAST_ID, id);
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