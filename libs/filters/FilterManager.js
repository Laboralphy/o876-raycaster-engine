import AbstractFilter from "../../libs/filters/AbstractFilter";

class FilterManager {

    constructor() {
        this._enabled = true;
        this._filters = [];
    }

    get filters() {
        return this._filters;
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(value) {
        this._enabled = value;
    }

    /**
     * Adds a new filter to the list
     * @param oFilter {AbstractFilter} the new filter
     */
    link(oFilter) {
        if (oFilter instanceof AbstractFilter) {
            if (this._enabled) {
                this._filters.push(oFilter);
            }
        } else {
            throw new Error('A non-filter instance shall not be linked to the filter manager');
        }
    }

    /**
     * removes all filters
     */
    clear() {
        this._filters = [];
    }

    /**
     * run process method for all filters
     * removes dead filters
     * @param time {number} advancement time
     */
    process(time) {
        this._filters = this
            ._filters
            .filter(f => !f.over())
            .map(f => {
                f.computeClock(time);
                f.process();
                return f;
            });
    }

    /**
     * run render method for all filters
     * updates the specified canvas
     * @param canvas {HTMLCanvasElement}
     */
    render(canvas) {
        if (this._enabled) {
            this._filters.forEach(f => f.render(canvas));
        }
    }

}

export default FilterManager;