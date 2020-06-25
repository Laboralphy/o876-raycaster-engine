class DebugDisplay {

    constructor() {
        this.clear();
    }

    clear() {
        this._lines = [];
    }

    print(...args) {
        this._lines.push(args.join(' '));
    }

    display(context, x, y) {
        const lines = this._lines;
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.textBaseline = 'top';
        context.font = '10px monospace';
        for (let i = 0, l = lines.length; i < l; ++i) {
            context.strokeText(lines[i], x, y + i * 12);
            context.fillText(lines[i], x, y + i * 12);
        }
    }
}


export default DebugDisplay;