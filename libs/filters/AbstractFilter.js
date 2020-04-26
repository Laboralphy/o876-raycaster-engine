/**
 * Filter Abstract
 *
 * @class AbstractFilter
 * @description this classe is a base class for any filter
 * One must fill the process function to perform any computation that will be rendered in the render function
 * which accepts a canvas as parameter.
 *
 * @author Raphaël Marandet
 * @date 2019-06-20
 */
class AbstractFilter {

    constructor() {
        this._bTerminateSwitch = false;
        this._nFirstProcessTime = 0;
        this._nLastProcessTime = 0;
        this._nDeltaTime = 0;
        this._nElapsedTime = 0;
        this._nProcessTime = 0;
    }

    /**
     * Called when it's render time.
     * The classe must modify the canvas
     * @param canvas {HTMLCanvasElement}
     */
    render(canvas) {
    }

    /**
     * computes delat and elapsed times values
     * @param time {number} cuurent time internal clock value (in milliseconds)
     */
    computeClock(time) {
        this._nProcessTime = time;
        if (this._nFirstProcessTime === 0) {
            this._nFirstProcessTime = time;
        }
        if (this._nLastProcessTime === 0) {
            this._nLastProcessTime = time;
        }
        this._nDeltaTime = time - this._nLastProcessTime;
        this._nElapsedTime = time - this._nFirstProcessTime;
        this._nLastProcessTime = time;
    }

    /**
     * Called when it's compute time
     */
    process() {
    }

    get delta() {
        return this._nDeltaTime;
    }

    get elapsed() {
        return this._nElapsedTime;
    }

    /**
     * must return true when the filter has finished
     * @returns {boolean}
     */
    over() {
        return this._bTerminateSwitch;
    }

    /**
     * must perform a clean up code because the filter is to be terminated
     */
    terminate() {
        this._bTerminateSwitch = true;
    }
}

export default AbstractFilter;