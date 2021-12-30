/**
 * Déverouillage d'une porte avec disparition du décal représentant la sérrure
 * @param game
 * @param locator
 */
export function main(game, locator) {
    const pos = game.getLocator(locator).cell;
    const { x, y } = pos;
    game.engine.lockDoor(x, y, false);
    game.rotateDecals(x, y, true);
    // supprimer le tag de lock
    game
      .getTagsAt(x, y)
      .filter(({ tag }) => tag[0] === 'lock')
      .forEach(tag => {
          tag.remove()
      })
}
