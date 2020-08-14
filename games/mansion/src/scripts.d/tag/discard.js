/**
 * Se débarrasser d'un objet qui a servi à déverouiller un block
 */
export function push(game, remove, x, y, ref) {
    if (!game.engine.isDoorLocked(x, y)) {
        game.logic.removeQuestItem(ref);
        remove();
    }
}