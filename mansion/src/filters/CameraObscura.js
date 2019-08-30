// GX Phone Abstract
// Effets visuels associés au smartphone
// Classe abstraite

import AbstractFilter from "../../../lib/src/filters/AbstractFilter";
import Easing from "../../../lib/src/easing";
import Rainbow from "../../../lib/src/rainbow";
import CanvasHelper from "../../../lib/src/canvas-helper";
import Reactor from "../../../lib/src/object-helper/Reactor";

const SCREEN_W = 195; // screen width
const SCREEN_H = 204; // screen height
const SCREEN_X = 102; // screen position relative to the start of the image skin
const SCREEN_Y = 26;

const BLUR_W = 32;
const BLUR_H = 32;


const STATE_HIDDEN = 0;
const STATE_RAISING = 11;
const STATE_VISIBLE = 20;
const STATE_FALLING = 31;

const DURATION_RAISING = 400;

const STYLE_BG_CIRCLE = 'rgba(255, 255, 255, 0.5)';
const STYLE_FG_CIRCLE = 'rgba(128, 255, 255, 1)';
const STYLE_SHAD_CIRCLE = 'rgba(0, 128, 255, 0.25)';

const CIRCLE_STD_RADIUS = 0.15;

const CIRCLE_NORMAL_ALPHA = 0.75;

class CameraObscura extends AbstractFilter {

    constructor() {
        super();
        CanvasHelper
            .loadCanvas('assets/camera/visor.png')
            .then(c => this._visor = c);
        this._nState = 0; // 0 = hidden; 10; start raising; 11 = raising; 20 = raised; 30 = start falling; 31; falling
        this._easing = new Easing();
        this._rainbow = new Rainbow();
        this._nTimeIndex = 0;
        this._oOccularCvs = CanvasHelper.createCanvas(SCREEN_W, SCREEN_H);
        this._oOccularCtx = this._oOccularCvs.getContext('2d');
        this._oBlurCvs = CanvasHelper.createCanvas(BLUR_W, BLUR_H);
        CanvasHelper.setImageSmoothing(this._oBlurCvs, true);
        this._oBlurCtx = this._oBlurCvs.getContext('2d');

        // HUD
        this._oEnergyData = {
            current: 25,
            max: 100,
            radius: 1
        };
        this._oManagedEnergyData = new Reactor(this._oEnergyData);

        this._oCircleCvs = CanvasHelper.createCanvas(SCREEN_W, SCREEN_H);
        this._oCircleCtx = this._oCircleCvs.getContext('2d');

        this._nPulseTime = 0;
        this._fAlpha = CIRCLE_NORMAL_ALPHA;
    }

    get y() {
        switch (this._nState) {
            case STATE_VISIBLE:
                return 0;

            case STATE_HIDDEN:
                return 1;

            default:
                return this._easing.y;
        }
    }

    get energy() {
        return this._oEnergyData;
    }

    processing(nStateAfter) {
        const easing = this._easing;
        this._nTimeIndex += this.delta;
        easing.compute(this._nTimeIndex);
        if (easing.over()) {
            this._nState = nStateAfter;
        }
    }

    process() {
        switch (this._nState) {
            case STATE_RAISING: // camera is raising
                this.processing(STATE_VISIBLE);
                break;

            case STATE_FALLING:
                this.processing(STATE_HIDDEN);
                break;
        }
        if (this._oEnergyData.current === this._oEnergyData.max) {
            ++this._nPulseTime;
            this._fAlpha = 0.25 * Math.sin(this._nPulseTime / 1.25) + 0.75;
        } else {
            this._fAlpha = CIRCLE_NORMAL_ALPHA;
        }
    }

    show() {
        if (this._nState === STATE_HIDDEN) {
            this._easing.from(0.5).to(0).steps(DURATION_RAISING).use(Easing.CUBE_DECCEL);
            this._nState = STATE_RAISING;
            this._nTimeIndex = 0;
        }
    }

    hide() {
        if (this._nState === STATE_VISIBLE) {
            this._easing.from(0).to(0.5).steps(DURATION_RAISING).use(Easing.CUBE_ACCEL);
            this._nState = STATE_FALLING;
            this._nTimeIndex = 0;
        }
    }

    renderCircle() {
        const data = this._oEnergyData;
        const energy = data.current;
        const energyMax = data.max;
        const PI_M_2 = Math.PI * 2;
        const PI_D_2 = Math.PI / 2;
        const fAngle = PI_M_2 * energy / energyMax - PI_D_2;
        const cvs = this._oCircleCvs;
        const ctx = this._oCircleCtx;
        const w = cvs.width;
        const h = cvs.height;
        const x = w >> 1;
        const y = h >> 1;
        const r = CIRCLE_STD_RADIUS * w * data.radius | 0;
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = STYLE_BG_CIRCLE;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, r, fAngle, PI_M_2 - PI_D_2);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.strokeStyle = STYLE_SHAD_CIRCLE;
        ctx.lineWidth = 8;
        ctx.arc(x, y, r, -PI_D_2, fAngle);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.strokeStyle = STYLE_FG_CIRCLE;
        ctx.lineWidth = 2;
        ctx.arc(x, y, r, -PI_D_2, fAngle);
        ctx.stroke();
        ctx.closePath();
    }

    render(canvas) {
        const state = this._nState;
        if (state === STATE_HIDDEN) {
            return;
        }
        const y = this.y;
        const ctx = canvas.getContext('2d');


        // 1 copy screen surface inside visor
        const xOffset = this.y * canvas.height;
        const xCopy = SCREEN_X;
        const yCopy = SCREEN_Y + xOffset;
        const bIS = CanvasHelper.getImageSmoothing(canvas);
        this._oOccularCtx.drawImage(canvas, xCopy, yCopy, SCREEN_W, SCREEN_H, 0, 0, SCREEN_W, SCREEN_H);

        ctx.save();

        // 2 blur
        const bAlphaChanging = state === STATE_FALLING || state === STATE_RAISING;
        if (bAlphaChanging) {
            ctx.globalAlpha = 1 - (y * 2);
        }
        CanvasHelper.setImageSmoothing(canvas, true);
        this._oBlurCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, BLUR_W, BLUR_W);
        ctx.drawImage(this._oBlurCvs, 0, 0, BLUR_W, BLUR_W, 0, 0, canvas.width, canvas.height);


        // 3 paste screen surface
        ctx.drawImage(this._oOccularCvs, 0, 0, SCREEN_W, SCREEN_H, xCopy, yCopy, SCREEN_W, SCREEN_H);

        CanvasHelper.setImageSmoothing(canvas, false);

        // 4 display camera
        ctx.drawImage(this._visor, 0, y * canvas.height);

        // 5 display circles
        if (this._oManagedEnergyData.getLog().length) {
            this.renderCircle();
            this._oManagedEnergyData.clear();
        }
        ctx.globalAlpha = this._fAlpha;
        ctx.drawImage(this._oCircleCvs, xCopy, yCopy);
        ctx.restore();
    }
}

export default CameraObscura;