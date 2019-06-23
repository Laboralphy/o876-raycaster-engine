import AbstractFilter from "../../filters/AbstractFilter";

/**
 * @class Timed
 * @description this filter will display a sub filter for a limited amount of time
 */
class Timed extends AbstractFilter {
    constructor({child, duration = 1000}) {
        super();
        this._duration = duration;
        this._child = child;
    }

    process() {
        this._child.computeClock(this._nProcessTime);
        this._child.process();
    }

    render(canvas) {
        this._child.render(canvas);
    }

    over() {
        return super.over() || this.elapsed >= this._duration;
    }
}

export default Timed;