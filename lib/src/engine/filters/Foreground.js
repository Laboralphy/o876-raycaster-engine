import AbstractFilter from "../../filters/AbstractFilter";

/**
 * StyleLayer Filter
 *
 * @class Foreground
 * @description This filter will apply a layer fill with one specified fill style
 * the fill style can be any valid HTML Canvas fill style such as a plain color, or a gradient
 */
class Foreground extends AbstractFilter {

    /**
     *
     * @param style {string} the fill style of the layer
     */
    constructor(style = 'black') {
        super();
        this._style = style;
    }


    render(canvas) {
        const context = canvas.getContext('2d');
        context.save();
        context.fillStyle = this._style;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();
    }
}

export default Foreground;