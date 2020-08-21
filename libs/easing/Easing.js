const LINEAR = '_linear';
const SMOOTHSTEP = '_smoothstep';
const SMOOTHSTEP_X2 = '_smoothstepX2';
const SMOOTHSTEP_X3 = '_smoothstepX3';
const SQUARE_ACCEL = '_squareAccel';
const SQUARE_DECCEL = '_squareDeccel';
const CUBE_ACCEL = '_cubeAccel';
const CUBE_DECCEL = '_cubeDeccel';
const CUBE_IN_OUT = '_cubeInOut';
const SINE = '_sine';
const COSINE = '_cosine';

/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */

const EasingFunctions = {
        // no easing, no acceleration
        linear: t => t,
        // accelerating from zero velocity
        easeInQuad: t => t*t,
        // decelerating to zero velocity
        easeOutQuad: t => t*(2-t),
        // acceleration until halfway, then deceleration
        easeInOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,

        // accelerating from zero velocity
        easeInCubic: t => t*t*t,
        // decelerating to zero velocity
        easeOutCubic: t => (--t)*t*t+1,
        // acceleration until halfway, then deceleration
        easeInOutCubic: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,

        // accelerating from zero velocity
        easeInQuart: t => t*t*t*t,
        // decelerating to zero velocity
        easeOutQuart: t => 1-(--t)*t*t*t,
        // acceleration until halfway, then deceleration
        easeInOutQuart: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,

        // accelerating from zero velocity
        easeInQuint: t => t*t*t*t*t,
        // decelerating to zero velocity
        easeOutQuint: t => 1+(--t)*t*t*t*t,
        // acceleration until halfway, then deceleration
        easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
    }

class Easing {

    static get LINEAR() { return LINEAR; }
    static get SMOOTHSTEP() { return SMOOTHSTEP; }
    static get SMOOTHSTEP_X2() { return SMOOTHSTEP_X2; }
    static get SMOOTHSTEP_X3() { return SMOOTHSTEP_X3; }
    static get SQUARE_ACCEL() { return SQUARE_ACCEL; }
    static get SQUARE_DECCEL() { return SQUARE_DECCEL; }
    static get CUBE_ACCEL() { return CUBE_ACCEL; }
    static get CUBE_DECCEL() { return CUBE_DECCEL; }
    static get CUBE_IN_OUT() { return CUBE_IN_OUT; }
    static get SINE() { return SINE; }
    static get COSINE() { return COSINE; }

    constructor(options = undefined) {
        if (options === undefined) {
            options = {};
        }
        this._yFrom = options.from || 0;         // starting value of y
        this._yTo = options.to || 1;             // ending value of y
        this._y = 0;                // y value computed as interpolator(x)
        this._x = 0;
        this._xMax = options.steps || 10;             // maximum value of x
        this._f = this[options.use] || Easing.LINEAR;
    }

    from(y) {
        this._y = this._yFrom = y;
        return this;
    }

    to(y) {
        this._yTo = y;
        return this;
    }

    steps(x) {
        this._xMax = x;
        return this;
    }

    use(f) {
        this.setFunction(f);
        return this;
    }

    reset() {
        this._y = this._yFrom;
        this._x = 0;
        return this;
    }

    setOutputRange(y0, y1) {
        this._yFrom = y0;
        this._yTo = y1;
    }

    setStepCount(v) {
        this._xMax = v;
    }

    setFunction(f) {
        if (typeof f === 'string') {
            this._f = this[f];
        } else {
            this._f = f;
        }
    }

    get y() {
        return this._y;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this.compute(value);
    }

    compute(x) {
        if (x === undefined) {
            x = ++this._x;
        } else {
            x = this._x = Math.max(0, Math.min(this._xMax, x));
        }
        const f = this._f;
        if (f && typeof f === 'function') {
            const v = f(x / this._xMax);
            this._y = this._yTo * v + (this._yFrom * (1 - v));
            return this;
        } else {
            throw new Error('easing function is not defined');
        }
    }

    over() {
        return this._x >= this._xMax;
    }

    [LINEAR](v) {
        return v;
    }

    [SMOOTHSTEP](v) {
        return v * v * (3 - 2 * v);
    }

    [SMOOTHSTEP_X2](v) {
        v = v * v * (3 - 2 * v);
        return v * v * (3 - 2 * v);
    }

    [SMOOTHSTEP_X3](v) {
        v = v * v * (3 - 2 * v);
        v = v * v * (3 - 2 * v);
        return v * v * (3 - 2 * v);
    }

    [SQUARE_ACCEL](v) {
        return v * v;
    }

    [SQUARE_DECCEL](v) {
        return 1 - (1 - v) * (1 - v);
    }

    [CUBE_ACCEL](v) {
        return v * v * v;
    }

    [CUBE_DECCEL](v) {
        return 1 - (1 - v) * (1 - v) * (1 - v);
    }

    [CUBE_IN_OUT](v) {
        if (v < 0.5) {
            v = 2 * v;
            return v * v * v;
        } else {
            v = (1 - v) * 2;
            return v * v * v;
        }
    }

    [SINE](v) {
        return Math.sin(v * Math.PI / 2);
    }

    [COSINE](v) {
        return 0.5 - Math.cos(-v * Math.PI) * 0.5;
    }
}


export default Easing;