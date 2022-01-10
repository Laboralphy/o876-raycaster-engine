/**
 * Transition vers un autre niveau
 * @param game {Game} instance du jeu
 * @param remove {function} fonction à appeler si l'on souhaite retirer le tag de la map
 * @param x {number} coordonnée x de la cellule ou se trouve le tag
 * @param y {number} coordonnée y de la cellule ou se trouve le tag
 * @param level {string} nom du niveau à charger
 * @param startpoint {number} numéro du startpoint
 */
export function enter(game, remove, x, y, level, startpoint) {
    game.loadLevel(level, { startpoint });
}
