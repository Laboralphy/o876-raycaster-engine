import AbstractFilter from "../../filters/AbstractFilter";

/**
 * @class Link
 * @description this filter links serveral filters.
 * When a filter is over, the next in place is initiated, until all filters are over.
 */
class Link extends AbstractFilter {

    constructor(children) {
        super();
        this._children = children;
    }

    process() {
        /**
         * the current active child
         * @type {AbstractFilter}
         */
        let currentChild = this._children.length > 0 ? this._children[0] : null;
        if (currentChild === null) {
            return;
        }
        if (currentChild.over()) {
            currentChild = this._children.shift();
        }
        if (currentChild !== null) {
            currentChild.computeClock(this._nProcessTime);
            currentChild.process();
        }
    }

    render(canvas) {
        if (this._children.length > 0) {
            this._children[0].render(canvas);
        }
    }

    over() {
        return super.over() || this._children.length === 0;
    }
}

export default Link;