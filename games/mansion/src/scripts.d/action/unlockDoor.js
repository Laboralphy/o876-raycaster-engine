/**
 * Déverouillage d'une porte avec disparition du décal représentant la sérrure
 * @param game
 * @param locator
 */
export function main(game, locator) {
    const pos = game.getLocator(locator).cell;
    game.engine.lockDoor(pos.x, pos.y, false);
    game.rotateDecals(pos.x, pos.y, true);
}