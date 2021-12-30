const { crc32, crc16 } = require('./hash-tools')
const INDEX_TYPES = require('./index-types')
const { CMP_FUNCTIONS } = require('./cmp-functions')
const { getType } = require('./get-type')

const ALLOWED_INDEXED_TYPES = new Set([
  'boolean',
  'number',
  'string'
])

class Indexer {
  constructor () {
    this._data = {}
  }

  get data () {
    return this._data
  }

  get indices () {
    return Object.keys(this._data)
  }

  /**
   * returns true if index exists.
   * @remark an index is names after the property it indexes
   * @param sIndex {string} index name (property name)
   * @returns {boolean}
   */
  isIndexed (sIndex) {
    return sIndex in this._data
  }

  /**
   * throw an error if index does not exist
   * @param sIndex {string} index name
   * @throws
   */
  checkIndex (sIndex) {
    if (!this.isIndexed(sIndex)) {
      throw new Error('ERR_INDEX_NOT_CREATED: ' + sIndex)
    }
  }

  /**
   * create a ne index
   * @param sIndex {string} nom de l'index
   * @param unique {boolean} si true alors l'index est unique
   * @param caseInsensitive {boolean} si true alors la recherche d'index doit respecter la casse
   * @param type {string}
   * @param size {number}
   */
  createIndex (sIndex, {
    unique = false,
    caseInsensitive = false,
    type = INDEX_TYPES.FULL,
    size = 6
  } = {}) {
    if (!this.isIndexed(sIndex)) {
      this._data[sIndex] = {
        values: {},
        type,
        size,
        unique,
        caseInsensitive
      }
    } else {
      throw new Error('ERR_INDEX_ALREADY_CREATED: ' + sIndex)
    }
  }

  /**
   * drop an index
   * @param sIndex {string} index name
   */
  dropIndex (sIndex) {
    if (this.isIndexed(sIndex)) {
      delete this._data[sIndex]
    }
  }

  /**
   * Indexed values must be of certain types
   * @param value {*}
   * @return {boolean}
   * @private
   */
  _isValidValue (value) {
    const sType = typeof value
    return value === null || ALLOWED_INDEXED_TYPES.has(sType)
  }

  _checkValueValidity (value) {
    if (!this._isValidValue(value)) {
      throw new Error('ERR_INVALID_INDEXED_VALUE_TYPE')
    }
  }

  /**
   * Returns the real index entry, according to the indexable value and the index options
   * @param oIndex {object}
   * @param value {string|number|null|boolean|Date}
   * @return {string}
   */
  getHashedEntry (oIndex, value) {
    const {
      caseInsensitive,
      type,
      size
    } = oIndex
    const sType = getType(value)
    switch (sType) {
      case 'null':
      case 'boolean':
        return value

      case 'date':
        return value.getTime().toString()
    }
    value = value.toString()
    if (caseInsensitive) {
      value = value.toLowerCase()
    }
    switch (type) {
      case INDEX_TYPES.PART:
        value = value.substr(size)
        break

      case INDEX_TYPES.CRC16:
        value = crc16(value).toString(36)
        break

      case INDEX_TYPES.CRC32:
        value = crc32(value).toString(36)
        break
    }
    return value
  }

  /**
   * makes an association between an index specific value and an id.
   * @param sIndex {string} index name (property)
   * @param value {string|number} property value to be indexed
   * @param id {string|number}
   */
  addIndexedValue (sIndex, value, id) {
    this.checkIndex(sIndex)
    this._checkValueValidity(value)
    id = id.toString()
    const oIndex = this._data[sIndex]
    const {
      values,
      unique
    } = oIndex
    const sHashedValue = this.getHashedEntry(oIndex, value)
    if (!(sHashedValue in values)) {
      values[sHashedValue] = unique
        ? id
        : new Set([id])
    } else {
      if (unique) {
        values[sHashedValue] = id
      } else {
        values[sHashedValue].add(id)
      }
    }
  }

  /**
   * destroy the association between an indexed value and an id
   * @param sIndex {string} index name
   * @param value {string|number}
   * @param id {string|number}
   */
  removeIndexedValue (sIndex, value, id) {
    this.checkIndex(sIndex)
    id = id.toString()
    const oIndex = this._data[sIndex]
    const {
      values,
      unique
    } = oIndex
    const sHashedValue = this.getHashedEntry(oIndex, value)
    if (sHashedValue in values) {
      if (unique) {
        delete values[sHashedValue]
      } else {
        values[sHashedValue].delete(id)
        if (values[sHashedValue].size === 0) {
          delete values[sHashedValue]
        }
      }
    }
  }

  _searchValues (sIndex, pFunction) {
    this.checkIndex(sIndex)
    const oIndex = this._data[sIndex]
    const aIds = new Set()
    for (const [value, indexReg] of Object.entries(oIndex.values)) {
      if (pFunction(value)) {
        if (oIndex.unique) {
          aIds.add(indexReg)
        } else {
          indexReg.forEach(id => aIds.add(id))
        }
      }
    }
    return [...aIds]
  }

  _searchSwitch (sIndex, value) {
    // value must be an object with a "$" property
    const sOp = Object.keys(value).find(s => s.startsWith('$'))
    if (sOp in CMP_FUNCTIONS) {
      const f = CMP_FUNCTIONS[sOp](value[sOp], sIndex)
      return this._searchValues(sIndex, f)
    } else {
      throw new Error('ERR_UNKNOWN_OPERATOR: ' + sOp)
    }
  }

  /**
   * search for any associated id with the given index value
   * @param sIndex {string}
   * @param value {string|number}
   * @returns {string[]|null}
   */
  search (sIndex, value) {
    this.checkIndex(sIndex)
    const oIndex = this._data[sIndex]
    const sType = getType(value)
    if (sType === 'regexp') {
      return this._searchSwitch(sIndex, { $regex: value })
    } else if (sType === 'object') {
      return this._searchSwitch(sIndex, value)
    } else {
      const sHashedEntry = this.getHashedEntry(oIndex, value)
      if (oIndex.type !== INDEX_TYPES.FULL) {
        return this._searchValues(sIndex, v => v === sHashedEntry)
      } else {
        if (sHashedEntry in oIndex.values) {
          return oIndex.unique
            ? [oIndex.values[sHashedEntry]]
            : [...oIndex.values[sHashedEntry]]
        }
      }
    }
    return null
  }
}

module.exports = Indexer
