/**
 * Filter Abstract
 *
 * @class Abstract
 * @description this classe is a base class for any filter
 * One must fill the process function to perform any computation that will be rendered in the render function
 * which accepts a canvas as parameter.
 *
 * @author Raphaël Marandet
 * @date 2019-06-20
 */
class Abstract {

    /**
     * Called when it's render time.
     * The classe must modify the canvas
     * @param canvas {HTMLCanvasElement}
     */
    render(canvas) {
    }

    /**
     * Called when it's compute time
     * @param time {number} cuurent time internal clock value (in milliseconds)
     */
    process(time) {
    }

    /**
     * must return true when the filter has finished
     * @returns {boolean}
     */
    over() {
        return true;
    }

    /**
     * must perform a clean up code because the filter is to be terminated
     */
    terminate() {
    }
}

export default Abstract;