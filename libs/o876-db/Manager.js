const path = require('path');
const Collection = require('./Collection');
const MemIo = require('./MemIo');
const Iio = require('./Iio');

class Manager {
    constructor () {
        this._path = '';
        this._io = null;
        this._collections = {};
    }

    get collections () {
        return this._collections;
    }

    /**
   *
   * @param sCollection
   * @param options {{ path: string, io: Iio }}
   * @returns {Promise<void>}
   */
    async createCollection (sCollection, options) {
        const sPath = options.path || this._path;
        const io = options.io || this._io;
        if (!(io instanceof Iio)) {
            throw new TypeError('Io must extend Iio (and an instance of..., do not use class itself)');
        }
        const sCollectionFolder = path.join(sPath, sCollection.toString());
        await io.createLocation(sCollectionFolder);
        const collection = new Collection(sCollectionFolder);
        collection.io = io;
        await collection.init();
        this._collections[sCollection] = collection;
    }

    async init (options) {
        this._io = options.io || new MemIo();
        this._path = options.path;
        if (!this._path) {
            throw new Error('Undefined database path');
        }
        const aCollections = options.collections || [];
        const promCreateCollections = aCollections.map(c => this.createCollection(c, {
            path: this._path,
            io: this._io
        }));
        await Promise.all(promCreateCollections);
        const indexes = options.indexes;
        if (indexes) {
            for (const [sColl, oIndexes] of Object.entries(indexes)) {
                const oColl = this.collections[sColl];
                for (const [sField, oIndex] of Object.entries(oIndexes)) {
                    await oColl.createIndex(sField, oIndex);
                }
            }
        }
    }
}

module.exports = Manager;
