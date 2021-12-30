class CacheHelper {
  constructor () {
    this._cache = {}
  }

  storeEntity (entity, cid) {
    const cache = this._cache
    if (cid in cache) {
      // Vérifier s'il existe déjà un entity du même id
      const iEntity = cache[cid].findIndex(c => c.id === entity.id)
      if (iEntity >= 0) {
        cache[cid][iEntity] = entity
      } else {
        cache[cid].push(entity)
      }
    } else {
      cache[cid] = [entity]
    }
  }

  removeEntity (entity, cid) {
    const cache = this._cache
    if (cid in cache) {
      cache[cid] = cache[cid].filter(c => c.id !== entity.id)
    }
  }

  loadEntities (cid) {
    return this._cache[cid]
  }
}

module.exports = CacheHelper
