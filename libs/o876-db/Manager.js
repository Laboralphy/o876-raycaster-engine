const path = require('path')
const Collection = require('./Collection')
const promFS = require('../prom-fs')

class Manager {
  constructor () {
    this._path = ''
    this._collections = {}
  }

  get collections () {
    return this._collections
  }

  async createCollection (sCollection) {
    const sPath = this._path
    const sCollectionFolder = path.join(sPath, sCollection.toString())
    if (!await promFS.stat(sCollectionFolder)) {
      await promFS.mkdir(sCollectionFolder)
    }
    const collection = new Collection(sCollectionFolder)
    await collection.init()
    this._collections[sCollection] = collection
  }

  async readCollections () {
    const sPath = this._path
    const aFolders = await promFS.ls(sPath)
    const aProms = aFolders
      .filter(d => d.dir)
      .map(d => this.createCollection(d.name))
    await Promise.all(aProms)
  }

  async init (options) {
    this._path = options.path || path.resolve(process.cwd())
    const aCollections = options.collections || []
    const sPath = this._path
    if (!await promFS.stat(sPath)) {
      console.warn('Database path', sPath, 'is unreachable')
      throw new Error('ERR_DATABASE_PATH_NOT_FOUND')
    }
    const promCreateCollections = aCollections.map(c => this.createCollection(c))
    await Promise.all(promCreateCollections)
    const indexes = options.indexes
    if (indexes) {
      for (const [sColl, oIndexes] of Object.entries(indexes)) {
        const oColl = this.collections[sColl]
        for (const [sField, oIndex] of Object.entries(oIndexes)) {
          await oColl.createIndex(sField, oIndex)
        }
      }
    }
  }
}

module.exports = Manager
