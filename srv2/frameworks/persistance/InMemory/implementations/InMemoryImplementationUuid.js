const InMemoryImplementationAbstract = require('./InMemoryImplementationAbstract')
const smalluuid = require('../../../../../libs/small-uuid')

class InMemoryImplementationUuid extends InMemoryImplementationAbstract {
  getNewId () {
    return Promise.resolve(smalluuid())
  }
}

module.exports = InMemoryImplementationUuid
