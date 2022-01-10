const CONSTS = require('../../consts')
/**
 * This script is run when an item is being "pushed".
 * The items are initialy nailed on walls, and the push action is aimed at acquire them.
 * @param game {Game} instance du jeu
 * @param remove {function} fonction à appeler si l'on souhaite retirer le tag de la map
 * @param x {number} coordonnée x de la cellule ou se trouve le tag
 * @param y {number} coordonnée y de la cellule ou se trouve le tag
 * @param item {string} identifiant de l'item accroché au bloc
 */
export function push(game, remove, x, y, item) {
    const d = game.logic.getItemData(item);
    game.soundEvent(CONSTS.AUDIO_EVENT_EXPLORE_PICKUP_ITEM, { item: d })
    game.ui.popup('EVENT_ITEM_ACQUIRED', d.icon, 'ITEMS.' + item + '.name');
    game.removeDecals(x, y);
    game.logic.addInventoryItem(item);
    remove();
}
