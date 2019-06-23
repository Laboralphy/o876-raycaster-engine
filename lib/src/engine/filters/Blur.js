import AbstractFilter from '../../filters/AbstractFilter';
import CanvasHelper from "../../canvas-helper";

class Blur extends AbstractFilter {

    constructor() {
        super();
        this._cvsBlur = null;
    }

    setRadius(n) {
        this._nRadius = n;
        this._cvsBlur = null;
    }

    createCanvas(width, height) {
        this._cvsBlur = CanvasHelper.createCanvas(width / this._nRadius | 0, height / this._nRadius | 0);
        CanvasHelper.setImageSmoothing(this._cvsBlur, true);
    }

    render(canvas) {
        if (this._cvsBlur === null) {
            this._cvsBlur = this.createCanvas(canvas.width, canvas.height);
        }
        const ctx = this._cvsBlur.getContext('2d');
        ctx.drawImage(
            canvas,
            0,
            0,
            canvas.width,
            canvas.height,
            0,
            0,
            this._cvsBlur.width,
            this._cvsBlur.height
        );
        canvas.getContext('2d').drawImage()
    }
}