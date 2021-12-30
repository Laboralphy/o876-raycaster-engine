const path = require('path')
const os = require('os')

function resolvePath (sPath) {
  if (sPath.startsWith('~/')) {
    sPath = os.homedir() + sPath.substr(1)
  }
  return path.resolve(sPath)
}

module.exports = {
  path: resolvePath(path.join(process.env.WORKING_PATH, process.env.DATABASE_PATH)),
  collections: ['levels'],
  indexes: {}
}
