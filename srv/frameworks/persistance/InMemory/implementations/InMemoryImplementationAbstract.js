class InMemoryImplementationAbstract {
  constructor () {
    this._data = {}
  }

  getNewId () {
    return Promise.reject(new Error('ERR_NOT_IMPLEMENTED'))
  }

  /**
   * Sauvegarde de l'entité, si l'identifiant de l'entité est null ou undefined un nouvel identifiant est attribué
   * @param entity {object}
   * @returns {Promise<object>}
   */
  async persist (entity) {
    if (entity.id === undefined || entity.id === null) {
      entity.id = await this.getNewId()
    }
    this._data[entity.id] = entity
    return Promise.resolve(entity)
  }

  /**
   * Suppression de l'entité, l'identifiant de l'entité doit être spécifié.
   * @param entity
   * @returns {Promise<*>}
   */
  remove (entity) {
    const data = this._data
    const id = entity.id
    if (id === undefined || id === null) {
      return Promise.reject(new Error('ERR_UNDEFINED_ID'))
    }
    if (id in data) {
      delete data[id]
      return Promise.resolve()
    } else {
      return Promise.reject(new Error('ERR_ENTITY_NOT_FOUND'))
    }
  }

  /**
   * Récupération d'une entité à partir de son identifiant
   * @param id {string|number}
   * @returns {Promise<never>}
   */
  get (id) {
    const data = this._data
    if (id in data) {
      return Promise.resolve(data[id])
    } else {
      return Promise.reject(new Error('ERR_ENTITY_NOT_FOUND'))
    }
  }

  /**
   * Récupération de toutes les entités
   * @returns {Promise<object[]>}
   */
  getAll () {
    return Promise.resolve(Object.values(this._data))
  }

  /**
   * Renvoie une liste d'entité satisfaisant le prédicat spécifié
   * @param pFunction {function}
   * @returns {Promise<object[]>}
   */
  async find (pFunction) {
    const aAll = await this.getAll()
    return aAll.filter(pFunction)
  }

  async getCount () {
    return Promise.resolve(Object.keys(this._data).length)
  }
}

module.exports = InMemoryImplementationAbstract
