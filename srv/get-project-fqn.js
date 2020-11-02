const path = require('path');

/**
 * Renvoie un chemin absolu vers une ressource relative au base_path
 * (qui est le chemin de base de la ou le serveur est lancé)
 * @param aPath
 * @return {*}
 */
function getProjectFQN(...aPath) {
    try {
        return path.resolve(...aPath);
    } catch (e) {
        console.error(aPath);
        throw new Error('resolving this path lead to an error. details of the incriminating path are just above.')
    }
}

module.exports = {
    getProjectFQN
};
