import AbstractFilter from "../../../libs/filters/AbstractFilter";
import CanvasHelper from "../../../libs/canvas-helper";

class Blindness extends AbstractFilter {
    constructor() {
        super();
        this._bInit = false
    }

    init(canvas) {
        this.oFlashCanvas = CanvasHelper.cloneCanvas(canvas)
        this.oFlashContext = this.oFlashCanvas.getContext('2d')
        this.oFlashContext.fillStyle = 'rgb(0, 0, 0)';
        this.oFlashContext.fillRect(0, 0, this.oFlashCanvas.width, this.oFlashCanvas.height);
        this.nTime = 0;
        this._bInit = true
    }

    buildBlindness (canvas) {
        const xGA = this.oFlashContext.globalAlpha;
        // Deg to rad
        const f = Math.sin(0.005 * this.elapsed + 3 * Math.PI / 2);
        if (f < 0) {
            this.oFlashContext.globalAlpha = 0;
        } else {
            this.oFlashContext.globalAlpha = f;
        }
        this.oFlashContext.fillRect(0, 0, this.oFlashCanvas.width, this.oFlashCanvas.height);
        this.oFlashContext.globalAlpha = xGA;

        const sGCO = this.oFlashContext.globalCompositeOperation;
        this.oFlashContext.globalCompositeOperation = 'lighter';
        this.oFlashContext.drawImage(canvas, 0, 0);
        this.oFlashContext.globalCompositeOperation = sGCO;
    }

    render(canvas) {
        if (!this._bInit) {
            this.init(canvas)
        }
        this.buildBlindness(canvas)
        canvas.getContext('2d').drawImage(this.oFlashCanvas, 0, 0)
    }
}

export default Blindness