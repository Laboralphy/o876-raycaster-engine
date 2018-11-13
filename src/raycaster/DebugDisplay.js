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

    display(context) {
        const lines = this._lines;
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        for (let i = 0, l = lines.length; i < l; ++i) {
            context.strokeText(lines[i], 8, 10 + i * 16);
            context.fillText(lines[i], 8, 10 + i * 16);
        }
    }



}


export default DebugDisplay;