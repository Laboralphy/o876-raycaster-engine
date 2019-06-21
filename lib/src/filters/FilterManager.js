class FilterManager {

    constructor() {
        this._filters = [];
    }

    /**
     * Adds a new filter to the list
     * @param oFilter {AbstractFilter} the new filter
     */
    link(oFilter) {
        this._filters.push(oFilter);
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
                f.process(time);
                return f;
            });
    }

    /**
     * run render method for all filters
     * updates the specified canvas
     * @param canvas {HTMLCanvasElement}
     */
    render(canvas) {
        this._filters.forEach(f => f.render(canvas));
    }

}


export default FilterManager;