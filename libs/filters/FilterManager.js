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

    removeTerminatedFilters() {
        for (let i = this._filters.length - 1; i >= 0; --i) {
            if (this._filters[i].over()) {
                this._filters.splice(i, 1)
            }
        }
    }

    /**
     * run process method for all filters
     * removes dead filters
     * @param time {number} advancement time
     */
    process(time) {
        this.removeTerminatedFilters()
        this
            ._filters
            .forEach(f => {
                f.computeClock(time);
                f.process();
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
