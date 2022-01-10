import AbstractFilter from "../../../../libs/filters/AbstractFilter";
import CanvasHelper from "../../../../libs/canvas-helper";
import Easing from "../../../../libs/easing";

/** Effet graphique temporisé
 * O876 Raycaster project
 * @class AmbientLight
 * @extends AbstractFilter
 * @date 2012-01-01
 * @author Raphaël Marandet
 *
 * Change graduellement le gradient de luminosité ambiente.
 */
class AmbientLight extends AbstractFilter {
    constructor ({
        engine
    }) {
        super()
        this._oEasing = new Easing()
        this._rc = engine.raycaster
        this._timeFactor = engine._TIME_INTERVAL
    }

    setLight (nLight, t) {
        if (x > 0 && t > 0) {
            this._oEasing
                .from(this._rc.options.shading.factor)
                .to(nLight)
                .steps(t * this._timeFactor / 1000 | 0)
                .use('smoothstep');
        }
    }

    process () {
        const e = this._oEasing
        e.compute()
        if (e.over()) {
            this.terminate()
        }
    }

    render (canvas) {
        const x = this._oEasing.x;
        if (x > 0) {
            const rc = this._rc;
            rc.options.shading.factor = x | 0;
            if (rc.storey) {
                rc.storey.options.shading.factor = x | 0;
            }
        }
    }
}

export default AmbientLight
