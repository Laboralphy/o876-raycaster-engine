const promFS = require('../prom-fs');
const path = require('path');
const Iio = require('./Iio');

class FsIo extends Iio {
    constructor ({ pretty = false } = {}) {
        super();
        this._pretty = pretty;
    }

    /**
     * @param location {string} location name
     * @return {Promise<string[]>}
     */
    async getList (location) {
        const aItems = await promFS.ls(location);
        return aItems.map(({ name }) => path.basename(name, '.json'));
    }

    /**
     * @param location {string} location name
     * @returns {Promise}
     */
    async createLocation (location) {
        const oDir = await promFS.stat(location);
        if (!oDir) {
            return promFS.mkdir(location);
        } else {
            return Promise.resolve();
        }
    }

    _getResourceKey (location, name) {
        return path.join(location, name + '.json');
    }

    /**
     * @param location {string} file location
     * @param name {string} file name
     * @returns {Promise<object>}
     */
    async read (location, name) {
        const data = await promFS.read(this._getResourceKey(location, name));
        return JSON.parse(data.toString());
    }

    /**
     * @param location {string} file location
     * @param name {string} file name
     * @param data {string} data to write
     * @returns {Promise<*>}
     */
    write (location, name, data) {
        return promFS
            .write(this._getResourceKey(location, name), this._pretty
                ? JSON.stringify(data, null, 4)
                : JSON.stringify(data)
            );
    }

    /**
     * @param location {string} file location
     * @param name {string} file name to remove
     * @returns {Promise}
     */
    remove (location, name) {
        return promFS.rm(this._getResourceKey(location, name));
    }
}

module.exports = FsIo;
