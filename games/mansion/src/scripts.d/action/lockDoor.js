/**
 * Verrouillage d'une porte avec rotation du décal représentant la serrure
 * Paramètre action : <locator>
 * @param game
 * @param locator {string} locator de la porte à vérrouiller
 */
export function main(game, locator) {
    const pos = game.getLocator(locator).cell;
    game.engine.lockDoor(pos.x, pos.y, true);
    game.rotateDecals(pos.x, pos.y, false);
}