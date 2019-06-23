import AbstractFilter from "../../filters/AbstractFilter";
import Easing from "../../easing";

/**
 * @class Pulse
 * @description This filter will accepts a sub filter and will display it with an alpha pulsating effect.
 */
class Pulse extends AbstractFilter {

    /**
     * The filter constructor.
     * @param from {number} the starting opacity value
     * @param to {number} the ending opacity value
     * @param loops {number} numbers of pulsating loogs before filter extinction
     * @param duration {number} duration of one pulsation
     * @param easing {string} function used to modifed
     * @param child {AbstractFilter} the filter whose opacity will pulsate
     */
    constructor({
        from = 1,
        to = 1,
        loops = Infinity,
        duration = 1000,
        easing = Easing.LINEAR,
        child
    }) {
        super();
        this._fromAlpha = from;
        this._toAlpha = to;
        this._use = easing;
        this._bPulse = from !== to && duration > 0;
        this._easing = new Easing();
        this._easing.steps(duration).use(easing);
        this._direction = 0;
        this._loops = loops;
        this._child = child;
        this.fwd();
    }

    fwd() {
        if (this._bPulse) {
            this._easing.from(this._fromAlpha).to(this._toAlpha).reset();
        }
    }

    bwd() {
        if (this._bPulse) {
            this._easing.to(this._fromAlpha).from(this._toAlpha).reset();
        }
    }

    yoyo() {
        switch (this._direction) {
            case 0:
                this.bwd();
                break;

            case 1:
                this.fwd();
                break;
        }
        this._direction = 1 - this._direction;
    }

    process() {
        const easing = this._easing;
        if (this._bPulse) {
            if (easing.over()) {
                if (--this._loops > 0) {
                    this.yoyo();
                } else {
                    return;
                }
            } else {
                easing.x += this.delta;
            }
        }
        this._child.computeClock(this._nProcessTime)
    }

    render(canvas) {
        super.render(canvas);
        const context = canvas.getContext('2d');
        context.save();
        context.globalAlpha = this._bPulse ? this._easing.y : this._fromAlpha;
        this._child.render(canvas);
        context.restore();
    }

    over() {
        return super.over() || this._loops <= 0;
    }
}

export default Pulse;