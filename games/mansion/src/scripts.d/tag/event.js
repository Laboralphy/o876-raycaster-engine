/**
 * Permet d'appeler un event-script
 * usage : event <event-script> [param1] [param2]
 * @param game {Game} instance du jeu
 * @param remove {function} fonction à appeler si l'on souhaite retirer le tag de la map
 * @param x {number} coordonnée x de la cellule ou se trouve le tag
 * @param y {number} coordonnée y de la cellule ou se trouve le tag
 * @param ref {string} référence du script event à appeler
 * @param params {string} liste des paramètres à transmettre au script d'évènement
 */
export function push(game, remove, x, y, ref, ...params) {
    game.runScript('event.' + ref, remove, x, y, ...params);
}

export function enter(game, remove, x, y, ref, ...params) {
    game.runScript('event.' + ref, remove, x, y, ...params);
}

