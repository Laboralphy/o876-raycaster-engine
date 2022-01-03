const path = require('path')
const {homeAliasPath} = require("../../libs/home-alias-path");

function resolvePath (sPath) {
  return homeAliasPath(sPath)
}

module.exports = {
  path: homeAliasPath(path.join(process.env.WORKING_PATH, 'database')),
  collections: ['levels'],
  indexes: {}
}
