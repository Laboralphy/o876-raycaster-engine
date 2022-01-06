const path = require('path')
const {homeAliasPath} = require("../../libs/home-alias-path");

function resolvePath (sPath) {
  return homeAliasPath(sPath)
}

module.exports = {
  path: homeAliasPath(path.join(process.env.SAVE_FILES_PATH, 'database')),
  collections: ['levels'],
  indexes: {}
}
