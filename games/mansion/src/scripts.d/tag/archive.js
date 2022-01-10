/**
 * Archivage d'une photo
 * usage : archive <ref>
 * Archiver une photo consiste à déplacer la photo d'un onglet vers l'onglet archive ppour indiquer que l'enigme à été résolue
 * Cela permet d'alleger l'affichage des photo dans les autres onglet d'indices.
 * @param game {Game} instance du jeu
 * @param remove {function} fonction à appeler si l'on souhaite retirer le tag de la map
 * @param x {number} coordonnée x de la cellule ou se trouve le tag
 * @param y {number} coordonnée y de la cellule ou se trouve le tag
 * @param ref {string} référence de la photo à archiver
 */
export function push(game, remove, x, y, ref) {
    if (!game.engine.isDoorLocked(x, y)) {
        if (game.album.hasTakenPhoto(ref)) {
          game.ui.popup('EVENT_PHOTO_ARCHIVED', 'album', 'PHOTOS.' + ref + '.title');
          game.album.archivePhoto(ref);
        }
        remove();
    }
}
