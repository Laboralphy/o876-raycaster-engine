import Halo from "libs/engine/filters/Halo";
import Rainbow from "libs/rainbow";

class RedHaze extends Halo {
    constructor() {
        super('#A00');
    }

    _buildColor(r, g, b, a) {
        this._color = Rainbow.rgba({r, g, b, a});
    }

    buildGradient(canvas, color) {
        const g = super.buildGradient(canvas, color);
        g.addColorStop(0.75, color);
        return g;
    }

    process() {
        super.process();
        const time = this.elapsed;
        this._buildColor(0xAA, 0, 0, 127 * (Math.sin(time / 160) + 1));
        this.clearGradient();
    }
}

export default RedHaze;