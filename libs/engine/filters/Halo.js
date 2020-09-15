import AbstractFilter from '../../filters/AbstractFilter';

/**
 * @class Halo
 *
 * @description this filter adds a colored circular halo around the screen.
 * This is useful in game where the ambiance needs to be darker (a black colored halo).
 * You must must specify a color.
 *
 */
class Halo extends AbstractFilter {

    /**
     * The constructor accepts a color for the halo
     * @param color {string}
     */
    constructor(color = 'black') {
        super();
        this._gradient = null;
        this._color = color;
    }

    buildGradient(canvas, color) {
        const context = canvas.getContext('2d');
        const w2 = canvas.width >> 1;
        const h2 = canvas.height >> 1;
        const radius = Math.sqrt(w2 * w2 + h2 * h2) | 0;
        const grad = context.createRadialGradient(w2, h2, h2, w2, h2, radius);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, color);
        return grad;
    }

    process(time) {
        super.process(time);
    }

    clearGradient() {
        this._gradient = null;
    }

    render(canvas) {
        if (this._gradient === null) {
            this._gradient = this.buildGradient(canvas, this._color);
        }
        super.render(canvas);
        const context = canvas.getContext('2d');
        context.save();
        context.fillStyle = this._gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();
    }
}

export default Halo;