const Indexer = require('./Indexer');
const { getType } = require('../get-type');
const { CMP_FUNCTIONS } = require('./cmp-functions');
const Cursor = require('./Cursor');

let DEFAULT_PRIMARY = 'id';

/**
 * @class Collection
 */
class Collection {
    constructor (sPath) {
        this._path = sPath;
        this._index = new Indexer();
        this._primary = DEFAULT_PRIMARY;
        this._keys = new Set();
        this._lastQuery = {
            fullscan: false,
            iterated: 0,
            indexed: 0
        };
        this._io = null;
    }

    /**
   * @returns {Iio}
   */
    get io () {
        return this._io;
    }

    /**
   * @param io {Iio}
   */
    set io (io) {
        this._io = io;
    }

    get collectionName () {
        return this._path.replace(/\\/g, '/').split('/').pop();
    }

    get operators () {
        return CMP_FUNCTIONS;
    }

    /**
   * Get the Indexer instance
   * @returns {Indexer}
   */
    get index () {
        return this._index;
    }

    /**
   * Initialize collection.
   * Loads all keys
   * @returns {Promise<void>}
   */
    async init () {
        await this.io.createLocation(this._path);
        const aKeys = await this.io.getList(this._path);
        this._keys = new Set(aKeys);
    }

    /**
   * Browse all documents and apply a function on each of them
   * Produce an array which reflect the result of the function for each document
   * @param pFunction {function}
   * @param keys {string[]} list of keys
   * @returns {Promise<unknown[]>}
   * @private
   */
    async _forEachDocument (pFunction, keys = null) {
        const bFullScan = !keys;
        const aKeys = bFullScan
            ? this.keys
            : keys;
        this._lastQuery.fullscan = this._lastQuery.fullscan || bFullScan;
        this._lastQuery.iterated += aKeys.length;
        return Promise
            .all(
                aKeys.map(
                    key => this
                        .get(key)
                        .then(data => pFunction(data, key) ? key : null)
                )
            ).then(aOkKeys => aOkKeys.filter(key => key !== null));
    }

    /**
   * create an index for the specified first-level property
   * @param sIndex {string} index/property name
   * @param options {object} index options
   * @returns {Promise<*[]>}
   */
    createIndex (sIndex, options = {}) {
        this._index.createIndex(sIndex, options);
        // Load all existing document, and index them
        return this
            ._forEachDocument((data, key) => {
                try {
                    this._index.addIndexedValue(sIndex, data[sIndex], key);
                } catch (e) {
                    switch (e.message) {
                    case 'ERR_INVALID_INDEXED_VALUE_TYPE': {
                        const sCollName = this.collectionName;
                        throw new Error('ERR_INVALID_INDEXED_VALUE: Indexed property ' + sCollName + '[' + key + '].' + sIndex + ' is missing, undefined or has an invalid value.');
                    }

                    default: {
                        break;
                    }
                    }
                }
            });
    }

    /**
   * drop the spécified index
   * @param sIndex {string} index/property name
   * @returns {Promise}
   */
    dropIndex (sIndex) {
        this._index.dropIndex(sIndex);
    }

    /**
   * Return the name of primary property for this collection
   * @returns {string}
   */
    get primary () {
        return this._primary;
    }

    /**
   * set the name of primary property for this collection
   * @param value {string}
   */
    set primary (value) {
        this._primary = value.toString();
    }

    /**
   * get the default name of primary property for all collections
   * @returns {string}
   */
    static get defaultPrimary () {
        return DEFAULT_PRIMARY;
    }

    /**
   * set the default name of primary property for all collections that will be instanciated from now
   * @returns {string}
   */
    static set defaultPrimary (value) {
        DEFAULT_PRIMARY = value.toString();
    }

    /**
   * Return true is the key is valid (not containing characters that will upset the file system)
   * @param key {string|number} document identifier
   * @return {boolean}
   * @private
   */
    _isKeyValid (key) {
    // must not contain special chars '/\?%*:|"<>.,;= '
    // must contain only char in range 32-127
        switch (typeof key) {
        case 'number': {
            return true;
        }

        case 'string': {
            return !!key.match(/^[^/\\?%*:|"<>.,;= ]*$/) ||
            !!key.match(/^[\u0021-\u007f]*$/);
        }

        default: {
            return false;
        }
        }
    }

    /**
   * Checks if a document matches the spécified predicate
   * @param data {object}
   * @param key {string|number} document identifier
   * @param pFunction {function} predicate
   * @returns {object|null}
   * @private
   */
    _matchingPredicate (data, key, pFunction) {
        return pFunction(data);
    }

    /**
   * return true if all the fields have the same values as the document
   * @param data {object} document
   * @param oFields {object} searching fields
   * @returns {object|null}
   * @private
   */
    _matchingFields (data, oFields) {
    // oFields : { element: { '$in': [ 'fire' ] } }
        return Object
            .keys(oFields)
            .every(sField => {
                const value = oFields[sField];
                if (value instanceof RegExp) {
                    return (data[sField].match(value));
                } else if (getType(value) === 'object') {
                    // get operator
                    const sOp = Object.keys(value).find(s => s.startsWith('$'));
                    if (sOp in CMP_FUNCTIONS) {
                        const f = CMP_FUNCTIONS[sOp](value[sOp], sField, data);
                        return f(data[sField]);
                    }
                } else {
                    return (data[sField] === value);
                }
            });
    }

    /**
   * Index a new document
   * @param key {string} document identifier
   * @param data {object} document
   */
    indexDocument (key, data) {
        const aIndices = this._index.indices;
        for (const idx of aIndices) {
            if (idx in data) {
                this._index.addIndexedValue(idx, data[idx], key);
            }
        }
    }

    /**
   * remove all index associated with the specifed document
   * @param key {string} document identifier
   * @param data {object} document to be unindexed
   */
    unindexDocument (key, data) {
        const aIndices = this._index.indices;
        for (const idx of aIndices) {
            if (idx in data) {
                this._index.removeIndexedValue(idx, data[idx], key);
            }
        }
    }

    /**
   * Write a document on file system
   * @param p1 {string|number|object} document identifier or document
   * @param [p2] {object|undefined} document
   * @returns {Promise<never>|*}
   */
    async save (p1, p2 = null) {
        let key, data;
        if (typeof p1 === 'object') {
            data = p1;
            if (!(this._primary in p1)) {
                throw new Error('ERR_NO_PRIMARY_KEY');
            }
            key = p1[this._primary];
        } else {
            key = p1;
            data = p2;
        }
        if (!this._isKeyValid(key)) {
            throw new Error('Key is invalid: ' + key);
        }
        return this.io.write(this._path, key, data)
            .then(() => {
                this._keys.add(key.toString());
                this.indexDocument(key, data);
            });
    }

    /**
   * retrieve a document from the file system
   * @param key {string|number} document identifier
   * @returns {Promise<object>}
   */
    async get (key) {
        return this.io.read(this._path, key);
    }

    /**
   * Physically removes document from file system
   * @param key {string|number} document identifier
   * @returns {Promise<void>}
   */
    async remove (key) {
        const data = await this.get(key);
        return this.io.remove(this._path, key)
            .then(() => {
                this._keys.delete(key);
                this.unindexDocument(key, data);
            });
    }

    /**
   * Return all the document keys
   * @returns {*[]}
   */
    get keys () {
        return [...this._keys];
    }

    /**
   * find documents, using a lambda function as predicate
   * @param pFunction {function} the function that filters documents
   * @param keys {string[]} an optional restrictive sets of keys
   * @returns {Promise<object[]>}
   * @private
   */
    async _findByPredicate (pFunction, keys = null) {
        return this._forEachDocument(
            (data, key) => this._matchingPredicate(data, key, pFunction),
            keys
        );
    }

    /**
   * find documents with clause
   * @param oClauses {object} a map field->value
   * @param keys {string[]} an optional restrictive set of id
   * @returns {Promise<object[]>}
   * @private
   */
    _findByNonIndexedValues (oClauses, keys = null) {
        return this._forEachDocument(
            data => {
                return this._matchingFields(data, oClauses);
            },
            keys
        );
    }

    /**
   * create an intersection of arrays of ids that matches all the given clauses
   * @param oClauses {object}
   * @returns {string[]}
   * @private
   */
    _getIndexedKeys (oClauses) {
        return Object
            .keys(oClauses)
            .map(f => this._index.search(f, oClauses[f]))
            .filter(f => !!f)
            .reduce(
                (prev, curr) => Array.isArray(prev)
                    ? curr.filter(value => prev.includes(value))
                    : curr
                , null
            );
    }

    async _findByClauses (oClauses) {
    // discriminer champ indéxés / non-indexé
        const aFields = Object.keys(oClauses);
        // garder ceux qui sont indexés
        const aIndexedFields = aFields.filter(f => this._index.isIndexed(f));
        const oIndexedClauses = {};
        aIndexedFields.forEach(c => {
            oIndexedClauses[c] = oClauses[c];
        });
        // isoler les non indexés
        const aNonIndexedFields = aFields.filter(f => !this._index.isIndexed(f));
        const oNonIndexedClauses = {};
        aNonIndexedFields.forEach(c => {
            oNonIndexedClauses[c] = oClauses[c];
        });
        const aIndexedKeys = aIndexedFields.length > 0
            ? this._getIndexedKeys(oIndexedClauses)
            : null;
        this._lastQuery.indexed += aIndexedKeys ? aIndexedKeys.length : 0;
        if (aNonIndexedFields.length > 0) {
            return this._findByNonIndexedValues(oNonIndexedClauses, aIndexedKeys);
        } else if (aIndexedKeys !== null) {
            return aIndexedKeys;
        } else {
            return [];
        }
    }

    async _findByLogical (oClause) {
        const aLogKeys = Object.keys(oClause);
        if (aLogKeys.length > 1) {
            return this._findByClauses(oClause);
        }
        const [sOperator] = aLogKeys;
        const operands = oClause[sOperator];
        switch (sOperator) {
        case '$or': {
        // operands must be an array
            if (!Array.isArray(operands)) {
                throw new TypeError('$or operand is expected to be an array');
            }
            const aSubClauses = await Promise.all(operands.map(o => this._findByLogical(o)));
            return [...aSubClauses.reduce((prev, curr) => {
                return new Set([...prev, ...curr]);
            }, new Set())];
        }

        case '$and': {
        // operands must be an array
            if (!Array.isArray(operands)) {
                throw new TypeError('$and operand is expected to be an array');
            }
            const aSubClauses = await Promise.all(operands.map(o => this._findByLogical(o)));
            return aSubClauses.reduce((prev, curr) => {
                if (prev === null) {
                    return curr;
                }
                return prev.filter(value => curr.includes(value));
            }, null);
        }

        case '$not': {
        // operands must be an object
            if (typeof operands !== 'object' || operands.constructor.name !== 'Object') {
                throw new TypeError('$not operand is expected to be an object');
            }
            const aFoundKeys = await this._findByLogical(operands);
            const aFoundKeySet = new Set(aFoundKeys);
            return this.keys.filter(k => !aFoundKeySet.has(k));
        }

        default: {
            return this._findByClauses(oClause);
        }
        }

    }

    async find (x) {
        this._lastQuery.fullscan = false;
        this._lastQuery.iterated = 0;
        this._lastQuery.indexed = 0;
        const aPromFoundKeys = (typeof x === 'function') ? this._findByPredicate(x) : this._findByLogical(x);
        const aFoundKeys = await aPromFoundKeys;
        return new Cursor(aFoundKeys, this);
    }

    getAll () {
        return new Cursor(this.keys, this);
    }

    get count () {
        return this.keys.length;
    }

    drop () {
        return Promise.all(this.keys.map(k => this.remove(k)));
    }
}

module.exports = Collection;
