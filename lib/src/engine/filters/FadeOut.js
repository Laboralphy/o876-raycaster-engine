import Easing from "../../easing";
import AbstractFilter from "../../filters/AbstractFilter";

/**
 * Fade In Filter
 *
 * @class FadeOut
 * @description Gradually adds a colored screen
 *
 */
class FadeOut extends AbstractFilter {

    constructor({
        color = 'black',
        duration = 1000,
        easing = Easing.LINEAR,
    }) {
        super();
        this._easing = new Easing();
        this._easing.from(0).to(1).steps(duration).use(easing);
        this._nStartedTime = 0;
        this._color = color;
    }


    render(canvas) {
        const context = canvas.getContext('2d');
        context.save();
        context.globalAlpha = this._easing.y;
        context.fillStyle = this._color;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();
    }

    process(time) {
        if (this._nStartedTime === 0) {
            this._nStartedTime = time;
        }
        if (!this._easing.over()) {
            this._easing.compute(time - this._nStartedTime);
        }
    }
}

export default FadeOut;