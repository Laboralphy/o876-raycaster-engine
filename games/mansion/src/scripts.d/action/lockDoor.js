/**
 * Verrouillage d'une porte avec apparition du décal représentant la serrure
 * Paramètre action : <locator>
 * @param game
 * @param locator {string} référence de l'endroit ou se trouve la porte à verrouiller
 */
export function main(game, locator) {
    const pos = game.getLocator(locator).cell;
    game.engine.lockDoor(pos.x, pos.y, true);
    game.rotateDecals(pos.x, pos.y, false);
}