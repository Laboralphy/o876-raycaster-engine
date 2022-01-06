/**
 * transition vers un autre niveau
 * @param game
 * @param remove
 * @param x
 * @param y
 * @param level
 * @param startpoint
 */
export function enter(game, remove, x, y, level, startpoint) {
    game.loadLevel(level, { startpoint });
}