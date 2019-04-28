import Events from 'events';
import CanvasHelper from '../../../../../src/canvas-helper';

const DEFAULT_CELL_WIDTH = 32;
const DEFAULT_CELL_HEIGHT = 32;

class CellRenderer {

    constructor() {
        this.events = new Events();
        this._cellWidth = DEFAULT_CELL_WIDTH;
        this._cellHeight = DEFAULT_CELL_HEIGHT;
        this._cellCanvas = CanvasHelper.createCanvas(32, 32);
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

    renderCell(oCanvas, grid, x, y) {
        this._cellContext.clearRect(0, 0, this._cellCanvas.width, this._cellCanvas.height);
        this.events.emit('paint', {
            x,
            y,
            canvas: this._cellCanvas,
            cell: grid[y][x]
        });
        oCanvas.getContext('2d').drawImage(this._cellCanvas, x * this.cellWidth, y * this.cellHeight);
    }

    render(oCanvas, grid, aModif) {
        for (let i = 0, l = aModif.length; i < l; ++i) {
            const {x, y} = aModif[i];
            this.renderCell(oCanvas, grid, x, y);
        }
    }
}






