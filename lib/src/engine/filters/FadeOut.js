import Pulse from "./Pulse";
import StyleLayer from "./StyleLayer";
import Link from "./Link";
import Easing from "../../easing";

/**
 * Fade Out Filter
 *
 * @class FadeOut
 * @description This filter applies on screen, a transparent layer which becomes more and more opaque over time.
 * The color, and duration of the process is set during instance construction
 *
 * This filter is often used to fade the screen to black.
 */
class FadeOut extends Link {

    /**
     * @param duration {number} duration of the period between opacity 0 and opacity 1
     * @param easing {string} the easing function
     * @param child {AbstractFilter} a child filter to fade out to
     */
    constructor({
        color = 'black',
        duration = 1000
    }) {
        const pc = new StyleLayer(color);
        const pulse = new Pulse({
            from: 0,
            to: 1,
            duration,
            easing: Easing.LINEAR,
            child: pc,
            loops: 1
        });
        super([pulse, pc]);
    }
}

export default FadeOut;