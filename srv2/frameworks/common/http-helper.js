/**
 * Requête traitée avec succès.
 * @param data {*}
 * @returns {HttpPresentation}
 */
function ok (data) {
  return {
    status: 200,
    body: data
  }
}

/**
 * Requête traitée avec succès mais pas d’information à renvoyer.
 * @returns {HttpPresentation}
 */
function noContent () {
  return {
    status: 204,
    body: null
  }
}

/**
 * @typedef HttpPresentation {object}
 * @property body {string} contenu du body de réponse
 * @property status {number} code de status http
 */

/**
 * Requete mal formée : La syntaxe de la requête est erronée.
 * @returns {HttpPresentation}
 */
function badRequest (sDetails = null) {
  return {
    status: 400,
    body: sDetails
  }
}

/**
 * Non autorisé : Une authentification est nécessaire pour accéder à la ressource.
 * @returns {HttpPresentation}
 */
function unauthorized () {
  return {
    status: 401,
    body: null
  }
}

/**
 * Le serveur a compris la requête, mais refuse de l'exécuter. Contrairement à l'erreur 401, s'authentifier ne fera
 * aucune différence. Sur les serveurs où l'authentification est requise, cela signifie généralement que
 * l'authentification a été acceptée mais que les droits d'accès ne permettent pas au client d'accéder à la ressource.
 * @returns {HttpPresentation}
 */
function forbidden () {
  return {
    status: 403,
    body: null
  }
}

/**
 * Ressource non trouvée.
 * @returns {HttpPresentation}
 */
function notFound () {
  return {
    status: 404,
    body: null
  }
}

/**
 * Conflit survenu lors de la dernière requete
 * @returns {HttpPresentation}
 */
function conflict () {
  return {
    status: 409,
    body: null
  }
}

/**
 * Erreur interne du serveur.
 * @param error {Error}
 * @returns {HttpPresentation}
 */
function internalError (error) {
  return {
    status: 500,
    body: error
  }
}

module.exports = {
  noContent,
  ok,
  internalError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict
}
