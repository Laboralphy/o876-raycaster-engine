import CanvasHelper from "../canvas-helper/CanvasHelper";
import Reactor from "../object-helper/Reactor";

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

    addSource(source) {
        const sourceReact = new Reactor(source);
        sourceReact.events.on('changed', ({key}) => this.invalidate());
        this._sources.push({source, sourceReact});
        this.invalidate();
        return source;
    }

    /**
     * Adds a new point source. The source is a point and radiates in a circle shape.
     * @param light {number}
     * @param x {number} center of circle
     * @param y {number} center of circle
     * @param fInnerCenter {number}
     * @param fOuterCenter {number}
     */
    addPointSource(light, x, y, fInnerCenter, fOuterCenter, ) {
        return this.addSource({
            type: 'c',
            x,
            y,
            r0: fInnerCenter,
            r1: fOuterCenter,
            light
        });
    }

    /**
     * adds a rectangle shape light source
     */
    addRectSource(light, x0, y0, x1, y1) {
        return this.addSource({
            type: 'r',
            x0,
            y0,
            x1,
            y1,
            light
        });
    }


    renderSource(source) {
        const cvs = this._canvas;
        const ctx = cvs.getContext('2d');
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        switch (source.type) {
            case 'c':
                const {x, y, r0, r1, light} = source;
                const g = ctx.createRadialGradient(x, y, r0, x, y, r1);
                g.addColorStop(0, 'white');
                g.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.globalAlpha = light;
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
            this._sources.forEach(({source}) => this.renderSource(source));
            const cvs = this._canvas;
            CanvasHelper.applyFilter(cvs, (x, y, {r}) => {
                csm.setLightMap(x, y, max * r / 255 | 0);
            });
            this._invalid = false;
        }
    }
}

export default LightSources;