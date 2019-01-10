import CanvasHelper from "../canvas-helper/CanvasHelper";

class LightSources {
    constructor() {
        this._sources = [];
        this._canvas = null;
        this._invalid = true;
    }

    setSize(w, h) {
        const cvs = CanvasHelper.createCanvas(w, h);
        const ctx = cvs.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, w, h);
        CanvasHelper.setImageSmoothing(cvs, true);
        this._canvas = cvs;
    }

    /**
     * Adds a new point source. The source is a point and radiates in a circle shape.
     * @param x {number} center of circle
     * @param y {number} center of circle
     * @param fInnerCenter {number}
     * @param fOuterCenter {number}
     * @param factor {number}
     */
    addPointSource(x, y, fInnerCenter, fOuterCenter, factor) {
        const source = {
            type: 'c',
            x,
            y,
            r0: fInnerCenter,
            r1: fOuterCenter,
            factor
        };
        this._sources.push(source);
        this.invalidate();
        return source;
    }


    renderSource(source) {
        const cvs = this._canvas;
        const ctx = cvs.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        switch (source.type) {
            case 'c':
                const {x, y, r0, r1, factor} = source;
                const g = ctx.createRadialGradient(x, y, r0, x, y, r1);
                g.addColorStop(0, 'white');
                g.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.globalAlpha = factor;
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(x, y, r1, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
    }

    invalidate() {
        this._invalid = true;
    }

    renderSources(csm, max) {
        if (this._invalid) {
            this._sources.forEach(source => this.renderSource(source));
            const cvs = this._canvas;
            CanvasHelper.applyFilter(cvs, (x, y, {r}) => {
                csm.setLightMap(x, y, max * r / 255 | 0);
            });
            this._invalid = false;
        }
    }
}

export default LightSources;