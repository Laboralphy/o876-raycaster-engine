/**
 * Archivage d'une photo
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
