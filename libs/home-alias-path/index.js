const path = require('path')
const os = require('os')

/**
 * Détecte la présence de ~ pour le changer en /home/...
 * @param sPath
 */
function homeAliasPath (sPath) {
    return path.resolve(sPath.startsWith('~/')
        ? os.homedir() + sPath.substr(1)
        : sPath)
}

module.exports = { homeAliasPath }
