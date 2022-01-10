/**
 * Changement de musique de fond.
 * usage : bgm <music-file>
 * Permet de changer la musique de fond jouée en changement de zone
 * @param game {Game} instance du jeu
 * @param remove {function} fonction à appeler si l'on souhaite retirer le tag de la map
 * @param x {number} coordonnée x de la cellule ou se trouve le tag
 * @param y {number} coordonnée y de la cellule ou se trouve le tag
 * @param ref {string} référence de la musique de fond à charger et à jouer.
 */
export function enter(game, remove, x, y, ref) {
    game._audioManager.playBGM(ref)
}
