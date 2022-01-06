/**
 * Valuers possible
 * createGenerator(6, 1679979167)
 * createGenerator(2, 733)
 */

/**
 * Fabrique un générateur d'identifiant à distribution cyclique pseudo aléatoire
 * @param range {number} nombre de caractères que l'identifiant peut contenir
 * @param prime {number} nombre premier inférieur à 6^range
 * @returns {function(number): string}
 */

function createGenerator (range, prime) {
  const r = Math.pow(36, range)
  return function (n) {
    const a = n * prime % r
    return a.toString(36)
  }
}

module.exports = {
  createGenerator
}
