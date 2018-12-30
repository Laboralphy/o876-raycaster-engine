const LOOP_NONE = 0;
const LOOP_FORWARD = 1;
const LOOP_YOYO = 2;

class TileAnimation {
    constructor() {
        // props
        this._count = 1;        // number of frames
        this._duration = 100;   // duration of a frame
        this._loop = 0;         // loop type 0: none; 1: forward; 2: yoyo; 3: random
        this._iterations = Infinity;    // number of iterations "Infinity" means : animate forever
        this._base = 0;         // a base index in the tileset

        // inner props
        this._index = 0;        // index of the frame
        this._time = 0;         // current frame time
        this._loopDir = 1;      // 0: index is increasing; 1: index is decreasing
        this._frozen = false;   // if true the animation is suspended
    }

    get base() {
        return this._base;
    }

    set base(value) {
        this._base = value;
    }

    get frozen() {
        return this._frozen;
    }

    set frozen(value) {
        this._frozen = value;
    }

    get index() {
        return this._index;
    }

    set index(value) {
        this._index = value;
    }

    get count() {
        return this._count;
    }

    set count(value) {
        this._count = value;
    }

    get duration() {
        return this._duration;
    }

    set duration(value) {
        this._duration = value;
    }

    get time() {
        return this._time;
    }

    set time(value) {
        this._time = value;
    }

    get loop() {
        return this._loop;
    }

    set loop(value) {
        this._loop = value;
    }

    get iterations() {
        return this._iterations;
    }

    set iterations(value) {
        this._iterations = value;
    }

    animate(nTimeInc) {
        if (this._frozen) {
            return;
        }
        const t = this._time + nTimeInc;
        const d = this._duration;
        const nIntPart = t / d | 0;
        this._time = t % d;
        for (let i = 0; i < nIntPart; ++i) {
            switch (this._loop) {
                case 0:
                    break;

                case 1:
                    if (this._index < this._count) {
                        this._index = (this._index + 1) % this._count;
                    } else {
                        this._index = 0;
                        --this._iterations;
                    }
                    break;

                case 2:
                    this._index += this._loopDir;
                    if (
                        (this._loopDir > 0 && this._index >= this._count) ||
                        (this._loopDir < 0 && this._index <= 0)
                    ) {
                        this.index = Math.min(this._count - 1, Math.max(0, this._index));
                        this._loopDir = -this._loopDir;
                        --this._iterations;
                    }
                    break;

                default:
                    throw new Error('animation: allowed loop codes are (0, 1, 2) ; not "' + this._loop + '"');
            }
        }
        if (this._iterations <= 0) {
            this._frozen = true;
        }
    }

    frame() {
        return this._base + this._index;
    }
}

export default TileAnimation;