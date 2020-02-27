import Pulse from "./Pulse";
import Foreground from "./Foreground";
import Easing from "../../easing";

/**
 * Fade In Filter
 *
 * @class FadeIn
 * @description This filter applies a colored opaque layer on the screen, and then fade it away over time.
 * The color of the layer and the duration of the fading is set during instance construction.
 *
 * usage :
 * const f = new FadeIn({color: "#FF8418", duration: 1000});
 * // will fill the screen with an opaque colored layer that will gradually vanish over 1 second
 */
class FadeIn extends Pulse {

    /**
     * @param duration {number} duration of the period between opacity 1 and opacity 0
     * @param color {string}
     */
    constructor({
        color = 'black',
        duration = 1000
    }) {
        super({
            from: 1,
            to: 0,
            duration,
            easing: Easing.LINEAR,
            child: new Foreground(color),
            loops: 1
        });
    }
}

export default FadeIn;