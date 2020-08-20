/**
 * Verouillage d'une porte avec apparition du décal représentant la sérrure
 * @param game
 * @param locator
 */
export function main(game, locator) {
    const pos = game.getLocator(locator).cell;
    game.engine.lockDoor(pos.x, pos.y, true);
    game.rotateDecals(pos.x, pos.y, false);
}