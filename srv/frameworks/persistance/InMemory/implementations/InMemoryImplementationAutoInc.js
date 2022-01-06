const InMemoryImplementationAbstract = require('./InMemoryImplementationAbstract')

class InMemoryImplementationAutoInc extends InMemoryImplementationAbstract {
  constructor () {
    super()
    this._lastId = 0
  }

  getNewId () {
    return Promise.resolve(++this._lastId)
  }
}

module.exports = InMemoryImplementationAutoInc
