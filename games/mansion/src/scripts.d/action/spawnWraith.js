import * as CONSTS from '../../consts';

/**
 * Apparition d'un wraith
 * @param game {Game}
 * @param ref {string} référence du sprite à faire apparaitre
 * @param locator {string} référence du locator du point d'apparition du sprite
 * @param duration {number} durée de l'apparition
 * @param score {number} point attribué lorsque le spectre est pris en photo
 * @returns {Entity}
 */
export function main(game, ref, locator, duration, score = 0) {
    const oWraith = game.spawnGhost(ref, locator);
    const sTargetLocator = locator + '_target'
    const destination = game.isLocatorDefined(sTargetLocator)
        ? game.getLocator(sTargetLocator).position
        : oWraith.position
    oWraith
        .data
        .wraith = {
            destination,
            duration,
            score
        };
    return oWraith;
}
