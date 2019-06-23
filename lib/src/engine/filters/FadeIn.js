import Pulse from "./Pulse";
import StyleLayer from "./StyleLayer";
import Easing from "../../easing";

/**
 * Fade In Filter
 *
 * @class FadeIn
 * @description This filter applies a colored opaque layer on the screen, and then fade it away over time.
 * The color of the layer and the duration of the fading is set during instance construction.
 */
class FadeIn extends Pulse {

    /**
     * @param duration {number} duration of the period between opacity 0 and opacity 1
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
            child: new StyleLayer(color),
            loops: 1
        });
    }
}

export default FadeIn;