/**
 * a silly class to factorize text
 */
import CanvasHelper from "../../../../../src/canvas-helper";
import * as CONSTS from "../../consts";

class CanvasTextFactory {
    constructor () {
        this._canvases = {};
        this._width = CONSTS.BLOCK_WIDTH;
        this._height = CONSTS.BLOCK_HEIGHT;
    }

    setSize(w, h) {
        let bModified = false;
        if (this._width !== w) {
            this._width = w;
            bModified = true;
        }
        if (this._height !== h) {
            this._height = h;
            bModified = true;
        }
        if (bModified) {
            this._canvases = {};
        }
    }

    drawTags(canvas, tags) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'yellow';
        ctx.strokeStyle = 'black';
        const hText = this._height / 3 | 0;
        ctx.font = hText + 'px bold Verdana';
        ctx.textBaseline = "top";
        tags.forEach((t, i) => {
            ctx.strokeText(t, 0, i * hText);
            ctx.fillText(t, 0, i * hText);
        });
    }

    drawMark(canvas, mark) {
        const {color, shape} = mark;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        const w = this._width;
        const h = this._height;
        const w2 = w >> 1;
        const h2 = h >> 1;
        const w4 = w >> 2;
        const h4 = h >> 2;

        switch (shape) {
            case CONSTS.SHAPE_CIRCLE:
                ctx.arc(w2, h2, w4, 0, Math.PI * 2);
                ctx.fill();
                break;

            case CONSTS.SHAPE_HEXAGON:
                ctx.beginPath();
                ctx.moveTo(w2, h4);
                ctx.lineTo(w2 + w4, (h2 + h4) >> 1);
                ctx.lineTo(w2 + w4, h - ((h2 + h4) >> 1));
                ctx.lineTo(w2, h2 + h4);
                ctx.lineTo(w4, h - ((h2 + h4) >> 1));
                ctx.lineTo(w4, (h2 + h4) >> 1);
                ctx.closePath();
                ctx.fill();
                break;

            case CONSTS.SHAPE_SQUARE:
                ctx.fillRect(w4, h4, w2, h2);
                break;

            case CONSTS.SHAPE_TRIANGLE:
                ctx.beginPath();
                ctx.moveTo(w2, h4);
                ctx.lineTo(w2 + w4, h - ((h2 + h4) >> 1));
                ctx.lineTo(w4, h - ((h2 + h4) >> 1));
                ctx.closePath();
                ctx.fill();
                break;

            case CONSTS.SHAPE_RHOMBUS:
                ctx.beginPath();
                ctx.moveTo(w2, h4);
                ctx.lineTo(w2 + w4, h2);
                ctx.lineTo(w2, h2 + h4);
                ctx.lineTo(w4, h2);
                ctx.closePath();
                ctx.fill();
                break;

            default:
                throw new Error('unknown shape : ' + shape);
        }

    }

    getCanvas(tags, mark) {
        if (tags.length === 0 && mark.shape === 0) {
            return null;
        }
        const sKey = JSON.stringify({tags, mark});
        if (sKey in this._canvases) {
            return this._canvases[sKey];
        } else {
            const canvas = CanvasHelper.createCanvas(this._width, this._height);
            this.drawTags(canvas, tags);
            this.drawMark(canvas, mark);
            return this._canvases[sKey] = canvas;
        }
    }
}

export default CanvasTextFactory;