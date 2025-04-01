class Cursor {
    constructor (keys, collection) {
        if (!Array.isArray(keys)) {
            console.error(keys);
            throw new TypeError('cursor keys are required to be an Array of number|string');
        }
        this._keys = keys;
        /**
         * @type {Collection}
         * @private
         */
        this._collection = collection;
        this._index = 0;
        this._current = null;
    }

    get keys () {
        return this._keys;
    }

    set index (value) {
        const l = this._keys.length;
        if (l === 0) {
            return;
        }
        if (this._index !== value) {
            this._current = null;
            this._index = Math.min(l, Math.max(-1, value));
        }
    }

    get index () {
        return this._index;
    }

    first () {
        this.index = 0;
        return this.current();
    }

    next () {
        ++this.index;
        return this.current();
    }

    previous () {
        --this.index;
        return this.current();
    }

    get count () {
        return this._keys.length;
    }

    /**
     * get the current record
     * @returns {Promise<Object>|Promise<Awaited<null>>}
     */
    async current () {
        if (this._index >= this._keys.length || this._index < 0) {
            return null;
        }
        if (this._current === null) {
            this._current = await this._collection.get(this._keys[this._index]);
        }
        return this._current;
    }

    /**
     *
     * @returns {Promise<Awaited<unknown>[]>}
     */
    async toArray (nStart = undefined, nCount = undefined) {
        if (nStart === undefined) {
            nStart = 0;
        }
        if (nCount === undefined) {
            nCount = this.count - nStart;
        }
        return Promise.all(this._keys.slice(nStart, nCount).map(k => this._collection.get(k)));
    }

    /**
     *
     * @param oCursor {Cursor}
     */
    merge (oCursor) {
        const aKeySet = new Set([
            ...this.keys,
            oCursor.keys
        ]);
        this._keys = [...aKeySet];
    }
}

module.exports = Cursor;
