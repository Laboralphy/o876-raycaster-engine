const INDEX_TYPES = require('./index-types');

class DbIndex {
    constructor ({ type: nIndexType = INDEX_TYPES.FULL, size = 6, unique = false, caseInsensitive = false }) {
        this.values = new Map();
        this.type = nIndexType;
        this.size = size;
        this.unique = unique;
        this.caseInsensitive = caseInsensitive;
    }
}

module.exports = DbIndex;
