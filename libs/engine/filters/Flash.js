import AbstractFilter from "libs/filters/AbstractFilter";
import Easing from "libs/easing";
import CanvasHelper from "libs/canvas-helper";

class Flash extends AbstractFilter {
    constructor({
        duration = 1000,
        strength = 3
    } = {}) {
        super();
        this._easing = new Easing();
        this
            ._easing
            .from(strength)
            .to(0)
            .steps(duration)
            .use(Easing.SQUARE_DECCEL);
        this._tmpCanvas = null;
    }

    process() {
        const easing = this._easing;
        easing.x += this.delta;

    }

    render(canvas) {
        if (!this._tmpCanvas) {
            this._tmpCanvas = CanvasHelper.createCanvas(canvas.width, canvas.height);
        }
        const tc = this._tmpCanvas;
        if (tc.width !== canvas.width) {
            tc.width = canvas.width;
        }
        if (tc.height !== canvas.height) {
            tc.height = canvas.height;
        }
        super.render(canvas);
        const context = canvas.getContext('2d');
        const tmpCtx = tc.getContext('2d');
        const n = Math.floor(this._easing.y);
        const f = this._easing.y - n;
        tmpCtx.drawImage(canvas, 0, 0);
        tmpCtx.save();
        tmpCtx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < n; ++i) {
            tmpCtx.drawImage(canvas, 0, 0);
        }
        tmpCtx.globalAlpha = f;
        tmpCtx.drawImage(canvas, 0, 0);
        tmpCtx.restore();
        context.drawImage(tc, 0, 0);
    }

    over() {
        return super.over() || this._easing.over();
    }
}

export default Flash;