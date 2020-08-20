/**
 * Archivage d'une photo
 */
export function push(game, remove, x, y, ref) {
    if (!game.engine.isDoorLocked(x, y)) {
        game.album.archivePhoto(ref);
        remove();
        game.ui.popup('EVENT_PHOTO_ARCHIVED', 'album', 'archive', ref);
    }
}