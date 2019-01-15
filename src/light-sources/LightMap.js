import MarkerRegistry from "../marker-registry/MarkerRegistry";
import Bresenham from "../bresenham";

class LightMap {
    constructor() {
        this._blocks = new MarkerRegistry();
        this._lmcell = new MarkerRegistry();

    }

    setSize(w, h, cs) {
        this._lmcell.setWidth(w);
        this._lmcell.setHeight(h);
        this._cellSize = cs;
    }

    setLightBlocking(x, y, b) {
        if (b) {
            this._blocks.mark(x, y);
        } else {
            this._blocks.unmark(x, y);
        }
    }

    traceLineOfLight(x0, y0, x1, y1) {
        Bresenham.line(x0, y0, x1, y1);
    }
}