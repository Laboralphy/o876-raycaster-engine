import Easing from "../../easing";
import Abstract from "./Abstract";

/**
 * Fade In Filter
 *
 * @class FadeIn
 * @description Starting with a uniform colored background, the filter slowly decrease the opacticity
 *
 */
class FadeIn extends Abstract {

    constructor({
        color = 'black',
        duration = 1000,
        easing = Easing.LINEAR,
    }) {
        super();
        this._easing = easing || new Easing({
            from: 1,
            to: 0,
            steps: duration,
            use: easing
        });
        this._nStartedTime = 0;
        this._color = color;
        this._bKilled = false;
        console.log(this);
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
            return;
        }
        const nDelta = time - this._nStartedTime;
        this._easing.compute(nDelta);
    }

    over() {
        return this._bKilled || this._easing.over();
    }
}

export default FadeIn;