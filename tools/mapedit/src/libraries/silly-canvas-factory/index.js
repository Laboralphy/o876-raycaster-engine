/**
 * a silly class to factorize text
 */
import CanvasHelper from "../../../../../src/canvas-helper";
import * as CONSTS from "../../consts";

class SillyCanvasFactory {
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
        const w = this._width;
        const h = this._height;
        const w2 = w >> 1;
        const h2 = h >> 1;
        const w4 = w >> 2;
        const h4 = h >> 2;

        switch (shape) {
            case CONSTS.SHAPE_NONE:
                break;

            case CONSTS.SHAPE_CIRCLE:
                ctx.strokeStyle = 'black';
                ctx.fillStyle = color;
                ctx.arc(w2, h2, w4, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                break;

            case CONSTS.SHAPE_HEXAGON:
                ctx.strokeStyle = 'black';
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(w2, h4);
                ctx.lineTo(w2 + w4, (h2 + h4) >> 1);
                ctx.lineTo(w2 + w4, h - ((h2 + h4) >> 1));
                ctx.lineTo(w2, h2 + h4);
                ctx.lineTo(w4, h - ((h2 + h4) >> 1));
                ctx.lineTo(w4, (h2 + h4) >> 1);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;

            case CONSTS.SHAPE_SQUARE:
                ctx.strokeStyle = 'black';
                ctx.fillStyle = color;
                ctx.fillRect(w4, h4, w2, h2);
                ctx.strokeRect(w4, h4, w2, h2);
                break;

            case CONSTS.SHAPE_TRIANGLE:
                ctx.strokeStyle = 'black';
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(w2, h4);
                ctx.lineTo(w2 + w4, h - ((h2 + h4) >> 1));
                ctx.lineTo(w4, h - ((h2 + h4) >> 1));
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;

            case CONSTS.SHAPE_RHOMBUS:
                ctx.strokeStyle = 'black';
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(w2, h4);
                ctx.lineTo(w2 + w4, h2);
                ctx.lineTo(w2, h2 + h4);
                ctx.lineTo(w4, h2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                break;

            case CONSTS.SHAPE_STARTPOINT:
                this.drawStartPoint(canvas, parseFloat(color));
                break;

            default:
                throw new Error('unknown shape : ' + shape);
        }

    }

    drawThings(canvas, things) {
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#000';
        const w = this._width;
        const h = this._height;
        const pad = 2;
        const w3 = Math.floor(w / 3);
        const h3 = Math.floor(h / 3);
        const w3_pad = w3 - pad - pad;
        const h3_pad = h3 - pad - pad;
        things.forEach(({x, y, s}) => {
            ctx.fillStyle = s === 0
                ? 'rgba(240, 150, 0, 0.75)'
                : s === 1
                    ? 'white' // this this is specialy selected
                    : '#FD0';
            ctx.strokeRect(x * w3 + pad, y * h3 + pad, w3_pad, h3_pad);
            ctx.fillRect(x * w3 + pad, y * h3 + pad, w3_pad, h3_pad);
        });
    }

    drawStartPoint(canvas, angle) {
        const ctx = canvas.getContext('2d');
        const w = this._width;
        const h = this._height;
        const pad = 2;
        const pad2 = pad << 1;
        const w2 = w >> 1;
        const h2 = h >> 1;
        ctx.save();
        ctx.lineWidth = 2;
        ctx.translate(w2, h2);
        ctx.rotate(angle * Math.PI);
        ctx.translate(-w2, -h2);
        ctx.beginPath();
        ctx.strokeStyle = '#FFF';
        ctx.arc(w2, h2, w2 - pad - pad,  0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.strokeStyle = '#06F';
        ctx.arc(w2, h2, w2 - pad,  0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        ctx.strokeStyle = '#F00';
        ctx.beginPath();
        ctx.moveTo(pad, h2);
        ctx.lineTo(w - pad, h2);
        ctx.lineTo(w - pad - pad2, h2 - pad2);
        ctx.lineTo(w - pad - pad2, h2 + pad2);
        ctx.lineTo(w - pad, h2);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    getCanvas(tags, mark, things, misc) {
        if (tags.length === 0 && mark.shape === 0 && things.length === 0) {
            return null;
        }
        const sKey = JSON.stringify({tags, mark, things, misc});
        if (sKey in this._canvases) {
            return this._canvases[sKey];
        } else {
            const canvas = CanvasHelper.createCanvas(this._width, this._height);
            this.drawTags(canvas, tags);
            this.drawMark(canvas, mark);
            this.drawThings(canvas, things);
            return this._canvases[sKey] = canvas;
        }
    }
}

export default SillyCanvasFactory;