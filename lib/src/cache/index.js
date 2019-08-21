class Cache {
    constructor() {
        this._cache = {};
    }

    memo(ref, func) {
        const c = this._cache;
        if (ref in c) {
            return c[ref];
        } else {
            return c[ref] = func();
        }
    }
}

export default Cache;