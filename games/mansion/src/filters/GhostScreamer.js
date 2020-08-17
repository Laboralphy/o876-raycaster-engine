import AbstractFilter from "libs/filters/AbstractFilter";

/**
 * Makes ghost screeam
 */

class GhostScreamer extends AbstractFilter {
    constructor() {
        super();
        this._aGhosts = [];
        this.TIME_OUT = 25;
    }


    addGhost(oGhost) {
        const g = {
            time: 0,
            sprite: oGhost.sprite,
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };
        this._aGhosts.push(g);
    }

    process() {
        let timeout = this.TIME_OUT;
        if (this._aGhosts.length > 0) {
            this._aGhosts = this._aGhosts.filter(function(g) {
                const x =  g.time / timeout;
                const x1 = 1 + x;
                const r = g.sprite.lastRendered;

                g.w = r.dw * x1 | 0;
                g.h = r.dh * x1 | 0;
                g.x = r.dx - ((g.w - r.dw) >> 1);
                g.y = r.dy - ((g.h - r.dh) >> 1);
                return (++g.time) < timeout;
            });
        }
    }

    render(oCanvas) {
        let ghosts = this._aGhosts;
        if (ghosts.length >= 0) {
            let oContext = oCanvas.getContext('2d');
            let x, x1, g, r, fAlpha = oContext.globalAlpha, gco = oContext.globalCompositeOperation;
            oContext.globalCompositeOperation = 'lighter';
            for (let i = 0, l = ghosts.length; i < l; ++i) {
                g = ghosts[i];
                r = g.sprite.lastRendered;
                x =  g.time / this.TIME_OUT;
                oContext.globalAlpha = 1 - (x * x);
                r.tileset
                    .drawTile(
                        oContext,
                        r.sx,
                        r.sy,
                        r.sw,
                        r.sh,
                        g.x,
                        g.y,
                        g.w,
                        g.h
                    );
            }
            oContext.globalCompositeOperation = gco;
            oContext.globalAlpha = fAlpha;
        }
    }
}


export default GhostScreamer;