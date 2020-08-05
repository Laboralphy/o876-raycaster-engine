const CONFIG = require('./config');

/**
 * renvoie l'identifiant de l'utilisateur connecté
 * @param req
 * @return {number|{auth: boolean, pending: boolean, name: string}|PublicKeyCredentialUserEntity|{displayName: string, id: string, vaultPath: string}}
 */
function getUserAuth(req) {
    if (CONFIG.getVariable('local_dev')) {
        return {
            id: 'local',
            displayName: 'local',
            vaultPath: 'local',
            dateCreation: Date.now()
        };
    } else {
        return ('user' in req) ? req.user : null;
    }
}

module.exports = {
    getUserAuth
};