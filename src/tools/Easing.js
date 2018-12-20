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

    constructor() {
        this._yFrom = 0;       // starting value of y
        this._yTo = 0;         // ending value of y
        this._y = 0;                // y value computed as interpolator(x)
        this._x = 0;
        this._xMax = 0;             // maximum value of x
        this._f = null;
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

    compute(x) {
        if (x === undefined) {
            x = ++this._x;
        } else {
            this._x = x;
        }
        const v = this._f(x / this._xMax);
        this._y = this._yTo * v + (this._yFrom * (1 - v));
        return this;
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