const Iio = require('./Iio');

class MemIo extends Iio {
    constructor () {
        super();
        this._data = {};
    }

    /**
     * @param location
     * @returns {Promise<string[]>}
     */
    getList (location) {
        return Promise.resolve(Object.keys(this._data[location]));
    }

    /**
     * @param location
     * @return {Promise}
     */
    createLocation (location) {
        this._data[location] = {};
        return Promise.resolve();
    }

    /**
     * @param location
     * @param name
     * @returns {Promise<Awaited<*>>}
     */
    read (location, name) {
        return Promise.resolve(this._data[location][name]);
    }

    /**
     * @param location
     * @param name
     * @param data
     * @returns {Promise<void>}
     */
    write (location, name, data) {
        this._data[location][name] = data;
        return Promise.resolve();
    }

    /**
     * @param location
     * @param name
     * @returns {Promise<void>}
     */
    remove (location, name) {
        const c = this._data[location];
        delete c[name];
        return Promise.resolve();
    }
}

module.exports = MemIo;
