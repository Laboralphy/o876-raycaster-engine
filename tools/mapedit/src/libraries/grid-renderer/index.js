import Events from 'events';
import CanvasHelper from '../../../../../src/libs/canvas-helper';

const DEFAULT_CELL_WIDTH = 32;
const DEFAULT_CELL_HEIGHT = 32;

const ZOOM_MIN = 16;
const ZOOM_MAX = 64;
const ZOOM_STEP = 8;

class GridRenderer {

    constructor() {
        this.events = new Events();
        this._cellWidth = DEFAULT_CELL_WIDTH;
        this._cellHeight = DEFAULT_CELL_HEIGHT;
        this._cellCanvas = CanvasHelper.createCanvas(DEFAULT_CELL_WIDTH, DEFAULT_CELL_WIDTH);
        this._cellContext = this._cellCanvas.getContext('2d');
    }


    get cellWidth() {
        return this._cellWidth;
    }

    set cellWidth(value) {
        this._cellWidth = value;
        this._cellCanvas.width = value;
    }

    get cellHeight() {
        return this._cellHeight;
    }

    set cellHeight(value) {
        this._cellHeight = value;
        this._cellCanvas.height = value;
    }

    zoomIn() {
        let n = Math.min(ZOOM_MAX, this.cellWidth + ZOOM_STEP);
        this.cellWidth = this.cellHeight = n;
    }

    zoomOut() {
        let n = Math.max(ZOOM_MIN, this.cellWidth - ZOOM_STEP);
        this.cellWidth = this.cellHeight = n;
    }

    renderCell(oCanvas, grid, x, y) {
        this._cellContext.clearRect(0, 0, this._cellCanvas.width, this._cellCanvas.height);
        this.events.emit('paint', {
            x,
            y,
            canvas: this._cellCanvas,
            cell: grid[y][x]
        });
        const ctx = oCanvas.getContext('2d');
        this._cellContext.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        this._cellContext.strokeRect(0, 0, this.cellWidth, this.cellHeight);
        ctx.clearRect(x * this.cellWidth, y * this.cellHeight, this.cellWidth, this.cellHeight);
        ctx.drawImage(this._cellCanvas, x * this.cellWidth, y * this.cellHeight);
    }

    render(oCanvas, grid, aModif) {
        const s = grid.length;
        const w = s * this._cellWidth;
        const h = s * this._cellHeight;

        if (oCanvas.width != w) {
            oCanvas.width = s * this._cellWidth;
        }
        if (oCanvas.height != h) {
            oCanvas.height= s * this._cellHeight;
        }

        if (aModif === undefined) {
            for (let y = 0; y < s; ++y) {
                for (let x = 0; x < s; ++x) {
                    this.renderCell(oCanvas, grid, x, y);
                }
            }
        } else {
            for (let i = 0, l = aModif.length; i < l; ++i) {
                const {x, y} = aModif[i];
                this.renderCell(oCanvas, grid, x, y);
            }
        }
    }
}


export default GridRenderer;



