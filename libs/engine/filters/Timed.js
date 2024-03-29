import AbstractFilter from "../../filters/AbstractFilter";

/**
 * @class Timed
 * @description this filter will display a sub filter for a limited amount of time, then terminate it.
 */
class Timed extends AbstractFilter {
    constructor({child = null, duration = 1000}) {
        super();
        this._duration = duration;
        this._child = child;
    }

    get child () {
        return this._child
    }

    process() {
        const c = this._child;
        if (!!c) {
            this._child.computeClock(this._nProcessTime);
            this._child.process();
        }
    }

    render(canvas) {
        const c = this._child;
        if (!!c) {
            this._child.render(canvas);
        }
    }

    over() {
        return super.over() || this.elapsed >= this._duration;
    }
}

export default Timed;
