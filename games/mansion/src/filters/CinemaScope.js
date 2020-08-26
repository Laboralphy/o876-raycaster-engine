import AbstractFilter from "libs/filters/AbstractFilter";

/**
 * StyleLayer Filter
 *
 * @class CinameScope
 * @description This filter will render two black strips (top and bottom)
 */
class CinemaScope extends AbstractFilter {
    constructor(size = 15) {
        super();
        this._size100 = size / 100;
    }

    render(canvas) {
        const context = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const s = this._size100;
        const hb = h * s | 0;
        context.save();
        context.fillStyle = 'black';
        context.fillRect(0, 0, w, hb);
        context.fillRect(0, h - hb, w, hb);
        context.restore();
    }
}

export default CinemaScope;