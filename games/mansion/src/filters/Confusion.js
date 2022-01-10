/** Effet graphique temporisé
 * Simule un effet d'étourdissement/confusion
 */
import AbstractFilter from "../../../../libs/filters/AbstractFilter";
import CanvasHelper from "../../../../libs/canvas-helper";

class Confusion extends AbstractFilter {
    constructor () {
        super()
        this.oConfCanvas = null
        this.oConfContext = null
        this._bInit = false
    }

    init (canvas) {
        if (!this._bInit) {
            this.oConfCanvas = CanvasHelper.cloneCanvas(canvas)
            this.oConfContext = this.oConfCanvas.getContext('2d')
            this.oConfContext.fillStyle = 'rgb(0, 0, 0)';
            this.oConfContext.fillRect(0, 0, this.oConfCanvas.width, this.oConfCanvas.height);
            this._bInit = true
        }
    }

    render (canvas) {
        this.init(canvas)
        this.buildConfusion(canvas)
        canvas.getContext('2d').drawImage(this.oConfCanvas, 0, 0)
    }

    toRad (n) {
        return n * 0.0174533
    }

    buildConfusion (canvas) {
        const nTime = this.elapsed >> 4
        const fx = Math.sin(this.toRad(nTime * 9.8)) + Math.sin(this.toRad(nTime * 4.77)) + 2;
        const fy = Math.sin(this.toRad(nTime * 4.1)) + Math.sin(this.toRad(nTime * 2.25)) + 2;
        const fx2 = Math.sin(this.toRad(nTime * 7.8)) + Math.sin(this.toRad(nTime * 5.77)) + 2;
        const fy2 = Math.sin(this.toRad(nTime * 3.1)) + Math.sin(this.toRad(nTime * 3.25)) + 2;
        const nx = fx * 16 | 0;
        const ny = fy * 8 | 0;
        const nx2 = fx2 * 16 | 0;
        const ny2 = fy2 * 8 | 0;

        this.oConfContext.drawImage(
            canvas,
            nx,
            ny,
            canvas.width - nx - nx2,
            canvas.height - ny - ny2,
            0,
            0,
            this.oConfCanvas.width,
            this.oConfCanvas.height
        );
    }
}

export default Confusion
