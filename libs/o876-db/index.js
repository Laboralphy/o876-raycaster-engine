const Collection = require('./Collection');
const Manager = require('./Manager');
const Indexer = require('./Indexer');
const { CMP_FUNCTIONS } = require('./cmp-functions');
const INDEX_TYPES = require('./index-types');

module.exports = {
    Collection,
    io: {
        mem: require('./MemIo'),
        fs: require('./FsIo'),
        interface: require('./Iio')
    },
    Manager,
    Indexer,
    INDEX_TYPES,
    operators: CMP_FUNCTIONS
};
