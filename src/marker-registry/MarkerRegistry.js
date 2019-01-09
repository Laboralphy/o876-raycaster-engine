/**
 * Manages a collection of 2D boolean value, in order to mark certain areas
 */
class MarkerRegistry {
    constructor() {
        this._s = new Set();
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
     * @param oContext {*} passed to f
     */
    iterate(f, oContext) {
        this._s.forEach(f, oContext);
    }
}


export default MarkerRegistry;