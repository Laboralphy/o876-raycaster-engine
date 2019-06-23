import AbstractFilter from '../../filters/AbstractFilter';
import CanvasHelper from "../../canvas-helper";

class Blur extends AbstractFilter {

    constructor(radius) {
        super();
        this._cvsBlur = null;
        this._cvsBlur2 = null;
        this.setRadius(radius);
    }

    setRadius(n) {
        this._nRadius = n;
        this._cvsBlur = null;
    }

    createCanvas(width, height) {
        this._cvsBlur = CanvasHelper.createCanvas(width / this._nRadius | 0, height / this._nRadius | 0);
        this._cvsBlur2 = CanvasHelper.createCanvas(width, height);
        CanvasHelper.setImageSmoothing(this._cvsBlur, true);
        CanvasHelper.setImageSmoothing(this._cvsBlur2, true);
    }

    render(canvas) {
        if (this._cvsBlur === null) {
            this.createCanvas(canvas.width, canvas.height);
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
        const ctx2 = this._cvsBlur2.getContext('2d');
        ctx2.drawImage(
            this._cvsBlur,
            0,
            0,
            this._cvsBlur.width,
            this._cvsBlur.height,
            0,
            0,
            this._cvsBlur2.width,
            this._cvsBlur2.height
        );
        canvas.getContext('2d').drawImage(this._cvsBlur2, 0, 0);
    }
}

export default Blur;