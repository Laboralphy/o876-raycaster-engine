/**
 * Manages a collection of 2D boolean value, in order to mark certain areas
 */
class MarkerRegistry {
    constructor() {
        this._s = new Set();
    }

    get state() {
        return [...this._s];
    }

    set state(value) {
        this._s = new Set(value);
    }

    /**
     * Marks this position
     * @param x {number}
     * @param y {number}
     */
    mark(x, y) {
        this._s.add(x << 16 | y);
    }

    /**
     * Unmarks this position
     * @param x {number}
     * @param y {number}
     */
    unmark(x, y) {
        this._s.delete(x << 16 | y);
    }

    /**
     * Clears all marks
     */
    clear() {
        this._s.clear();
    }

    /**
     * returns true if this position has previously been marked, false otherwise
     * @param x {number}
     * @param y {number}
     * @return {boolean}
     */
    isMarked(x, y) {
        return this._s.has(x << 16 | y);
    }

    /**
     * iterates through all markers and call a function back for each marked position
     * @param f {function}
     */
    iterate(f) {
        this._s.forEach(n => {
            const y = n & 0xFFFF;
            const x = n >> 16;
            f(x, y);
        });
    }

    /**
     * Merges the specified marker registry into this one.
     * This operation mutates this registry
     * @param mr {MarkerRegistry}
     */
    merge(mr) {
        mr._s.forEach(v => this._s.add(v));
    }

    /**
     * Returns an array of {x, y} for each marked cell
     */
    toArray() {
        const a = [];
        this.iterate((x, y) => {
            a.push({x, y});
        });
        return a;
    }
}


export default MarkerRegistry;