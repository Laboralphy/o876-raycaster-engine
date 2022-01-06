/**
 * Affichage de la photo, puis transition à une autre photo via un effet spécial "bruit de perlin"
 */

import AbstractFilter from "libs/filters/AbstractFilter";
import Perlin from "libs/perlin";
import Tools2D from "libs/tools2d";
import PixelProcessor from "libs/pixel-processor";
import CanvasHelper from "libs/canvas-helper";
import Easing from "libs/easing";

const PERLIN_SIZE = 128;
const MOGRIFY_STEPS = 64;

const PHOTO_TARGET_WIDTH = 180;
const PHOTO_TARGET_HEIGHT = 180;
const PHOTO_BORDER_SIZE = 8;

const PHOTO_STILL_TIME = 1500; // ms

const SPOT_RADIUS = 8;


const STATE_INIT = 0;
const STATE_PHOTO0_BUILDING = 5;
const STATE_PHOTO0_FADE_IN = 10;
const STATE_PHOTO0_STILL = 20;
const STATE_MOGRIFY = 30;
const STATE_PHOTO1_STILL = 40;
const STATE_PHOTO1_FADE_OUT = 50;
const STATE_OVER = 60;

class PhotoMogrify extends AbstractFilter {
    /**
     *
     * @param src {HTMLCanvasElement}
     * @param dst {HTMLCanvasElement}
     * @param end {function}
     */
    constructor({
        src, dst, end = function() {}
    }) {
        super();
        if (src.width !== dst.width || src.height !== dst.height) {
            throw new Error('PhotoMogrify : both canvases must be the same size');
        }
        this._iMogrifyStep = 0;
        this._photo0 = src;
        this._photo1 = dst;
        this._state = STATE_INIT;
        this._mogrifyRegistry = null;
        this._workingCanvas = CanvasHelper.createCanvas(src.width, src.height);
        this._renderCanvas = null;

        this._easing = new Easing();
        this._mogrifyCanvases = [];
        this._renderCanvas = CanvasHelper.createCanvas(PHOTO_TARGET_WIDTH + (PHOTO_BORDER_SIZE << 1), PHOTO_TARGET_HEIGHT + (PHOTO_BORDER_SIZE << 1));
        this._fAlpha = 0;
        this._timer = 0;
        this._spots = [];
        this._end = end; // the end callback
    }

    /**
     * A partir d'un bruit de perlin, discretise le bruit sur un certain nombnre de palier (MOGRIFY_STEPS)
     * puis créé un registre permettant de classer les pixels selon leur valeur palier
     * @returns {[]}
     * @private
     */
    _createMogrifyRegistry() {
        const aBaseNoise = Tools2D.createArray2D(PERLIN_SIZE, PERLIN_SIZE, (x, y) => Math.random(), Float32Array);
        const pn = Perlin.generate(aBaseNoise, 6);
        const aRegistry = [];
        for (let i = 0; i < MOGRIFY_STEPS; ++i) {
            aRegistry[i] = [];
        }
        Tools2D.walk2D(pn, (x, y, value) => {
            // discreet
            const n = value * MOGRIFY_STEPS | 0;
            const rn = aRegistry[n];
            rn.push({x, y});
        });
        return aRegistry;
    }

    /**
     * Créé un canvas, copie dans ce canvas,, uniquemennt les pixel dont la valeur dans le masque de perlin est comprise
     * entre deux valeur spécifiée, color ce masque d'une couleur unie spécifiée.
     * @param n0 {number} valeur minimum des pixels dans le masque (0.. MOGRIFY_STEPS -1)
     * @param n1 {number} valeur maximum des pixels dans le masque (0.. MOGRIFY_STEPS -1)
     * @param color {string} couleur
     * @private
     */
    _createMaskedCanvasFromRegistry(n0, n1, color) {
        const mc = CanvasHelper.createCanvas(PERLIN_SIZE, PERLIN_SIZE);
        const mr = this._mogrifyRegistry;
        const ctx = mc.getContext('2d');
        ctx.fillStyle = color;
        for (let n = n0; n <= n1; ++n) {
            const mrn = mr[n];
            if (mrn !== undefined) {
                for (let {x, y} of mr[n]) {
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        }
        return mc;
    }

    /**
     * copie les pixel de la photo dans un nouveau canvas, mais uniquement les pixel dont le le point du masque-perlin
     * correspondant est compris entre deux valeur.
     * @param n0
     * @param n1
     * @param cvsPhoto
     * @returns {HTMLCanvasElement}
     * @private
     */
    _combinePhotoAndMask(n0, n1, cvsPhoto) {
        if (n0 > n1) {
            n0 = n1;
        }
        const pw = cvsPhoto.width;
        const ph = cvsPhoto.height;
        const rc = CanvasHelper.createCanvas(pw, ph);
        const mc = this._createMaskedCanvasFromRegistry(n0, n1, 'black');
        const rctx = rc.getContext('2d');
        rctx.drawImage(mc, 0, 0, mc.width, mc.height, 0, 0, rc.width, rc.height);
        rctx.save();
        rctx.globalCompositeOperation = 'source-atop';
        rctx.drawImage(cvsPhoto, 0, 0, pw, ph, 0, 0, rc.width, rc.height);
        return rc;
    }

    _renderSpot(dstctx, x, y) {
        if (!this._spot) {
            this._spot = CanvasHelper.createCanvas(SPOT_RADIUS * 2 + 1, SPOT_RADIUS * 2 + 1);
            const ctx = this._spot.getContext('2d');
            const g = ctx.createRadialGradient(SPOT_RADIUS, SPOT_RADIUS, 0, SPOT_RADIUS, SPOT_RADIUS, SPOT_RADIUS);
            g.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
            g.addColorStop(0.5, 'rgba(0, 255, 255, 0.75)');
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.arc(SPOT_RADIUS, SPOT_RADIUS, SPOT_RADIUS, 0, Math.PI * 2);
            ctx.fill();
        }
        dstctx.drawImage(this._spot, x, y);
    }

    _addSpots(dstcvs, aPoints, n) {
        const nPointCounts = aPoints.length;
        if (nPointCounts > 0) {
            const wdstcvs = dstcvs.width;
            const hdstcvs = dstcvs.height;
            for (let i = 0; i < n; ++i) {
                const {x, y} = aPoints[Math.random() * nPointCounts | 0];
                this._spots.push({
                    x: (wdstcvs * x / PERLIN_SIZE | 0) - SPOT_RADIUS,
                    y: (hdstcvs * y / PERLIN_SIZE | 0) - SPOT_RADIUS,
                    n: 1
                });
            }
        }
    }

    _renderSpots(dstcvs) {
        const spots = this._spots;
        const l = spots.length;
        if (l > 0) {
            const dstctx = dstcvs.getContext('2d');
            dstctx.save();
            dstctx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < l; ++i) {
                const si = spots[i];
                const {x, y, n} = si;
                dstctx.globalAlpha = n;
                this._renderSpot(dstctx, x, y);
                si.n -= 0.25;
            }
            dstctx.restore();
        }
        this._spots = spots.filter(s => s.n > 0);
    }


    /**
     * à partir de deux photo de même taille, calcule un troisième photo qui est la combianison des deux premières.
     * @param n
     * @param c0
     * @param c1
     * @private
     */
    _transMogrify(n, c0, c1) {
        const nMarge = 2;
        const wc = this._workingCanvas;
        const ctx = wc.getContext('2d');
        ctx.fillStyle = 'cyan';
        ctx.fillRect(0, 0, wc.width, wc.height);
        const r0 = this._combinePhotoAndMask(0, n - nMarge, c0);
        const r1 = this._combinePhotoAndMask(n + nMarge, MOGRIFY_STEPS - 1, c1);
        ctx.drawImage(r0, 0, 0);
        ctx.drawImage(r1, 0, 0);
        // prendre un certain nombre de point de la marge et faire des cercle gradiant brillant
        this._addSpots(wc, this._mogrifyRegistry[n], 32);
        this._renderSpots(wc);
    }

    /**
     * Dessine src dans dst au centre
     * @param src {HTMLCanvasElement}
     * @param dst {HTMLCanvasElement}
     * @param width {number}
     * @param height {number}
     */
    drawImageAtCenter(src, dst, width = -1, height = -1) {
        if (width < 0) {
            width = src.width;
        }
        if (height < 0) {
            height = src.height;
        }
        const x = (dst.width - width) >> 1;
        const y = (dst.height - height) >> 1;
        dst
            .getContext('2d')
            .drawImage(src,
                0, 0, src.width, src.height,
                x, y, width, height);
    }

    /**
     * Rempli le rendercanvas avec un photo et une bordure blanche
     * @param oPhotoCvs {HTMLCanvasElement}
     */
    buildPhoto(oPhotoCvs) {
        const canvas = this._renderCanvas;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'antiquewhite';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.drawImageAtCenter(oPhotoCvs, canvas, PHOTO_TARGET_WIDTH, PHOTO_TARGET_HEIGHT);
    }

    process() {
        switch (this._state) {
            case STATE_INIT:
                this._state = STATE_PHOTO0_BUILDING;
                break;

            case STATE_PHOTO0_BUILDING:
                this.buildPhoto(this._photo0);
                this._state = STATE_PHOTO0_FADE_IN;
                this
                    ._easing
                    .from(0)
                    .to(1)
                    .steps(10)
                    .use(Easing.LINEAR);
                break;

            case STATE_PHOTO0_FADE_IN:
                this._easing.compute();
                this._fAlpha = this._easing.y;
                if (this._easing.over()) {
                    this._fAlpha = 1;
                    this._state = STATE_PHOTO0_STILL;
                    this._timer = this.elapsed + PHOTO_STILL_TIME;
                    this._mogrifyRegistry = this._createMogrifyRegistry();
                }
                break;

            case STATE_PHOTO0_STILL:
                if (this.elapsed > this._timer) {
                    this._state = STATE_MOGRIFY;
                }
                break;

            case STATE_MOGRIFY:
                this._transMogrify(this._iMogrifyStep++, this._photo1, this._photo0);
                this.drawImageAtCenter(this._workingCanvas, this._renderCanvas, PHOTO_TARGET_WIDTH, PHOTO_TARGET_HEIGHT);
                if (this._iMogrifyStep >= MOGRIFY_STEPS) {
                    this._state = STATE_PHOTO1_STILL;
                    this._timer = this.elapsed + PHOTO_STILL_TIME;
                    this.buildPhoto(this._photo1);
                }
                break;

            case STATE_PHOTO1_STILL:
                if (this.elapsed > this._timer) {
                    this._state = STATE_PHOTO1_FADE_OUT;
                    this
                        ._easing
                        .reset()
                        .from(1)
                        .to(0)
                        .steps(30)
                        .use(Easing.LINEAR);
                }
                break;

            case STATE_PHOTO1_FADE_OUT:
                this._easing.compute();
                this._fAlpha = this._easing.y;
                if (this._easing.over()) {
                    this._state = STATE_OVER;
                    if (typeof this._end === 'function') {
                        this._end(this);
                    }
                }
                break;

            case STATE_OVER:
                break;
        }
    }

    over() {
        return this._state === STATE_OVER;
    }

    flip(canvas, fAlpha = 1) {
        const ctx = canvas.getContext('2d');
        if (fAlpha < 1) {
            ctx.save();
            ctx.globalAlpha = fAlpha;
        }
        this.drawImageAtCenter(this._renderCanvas, canvas);
        if (fAlpha < 1) {
            ctx.restore();
        }
    }

    render(canvas) {
        this.flip(canvas, this._fAlpha);
    }
}

export default PhotoMogrify;