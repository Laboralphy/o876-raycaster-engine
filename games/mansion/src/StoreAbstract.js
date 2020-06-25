class StoreAbstract {
    /**
     * the constructor requires a store instance
     */
    constructor(sPrefix) {
        this._store = null;
        this._prefix = sPrefix
    }

    getPrefixed(s) {
        if (this._prefix) {
            return this._prefix + '/' + s;
        } else {
            return s;
        }
    }

    /**
     * @return {Vuex.Store}
     */
    get store() {
        return this._store;
    }

    /**
     *
     * @param value {Vuex.Store}
     */
    set store(value) {
        this._store = value;
    }

    /**
     * dispatches an action to the store
     * @param action {string}
     * @param payload {*}
     */
    dispatch(action, payload) {
        return this.store.dispatch(this.getPrefixed(action), payload);
    }

    commit(mutation, payload) {
        this.store.commit(this.getPrefixed(mutation), payload);
    }

    prop(getter) {
        return this.store.getters[this.getPrefixed(getter)];
    }
}

export default StoreAbstract;