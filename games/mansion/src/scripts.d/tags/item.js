/**
 * This script is run when an item is being "pushed".
 * The items are initialy nailed on walls, and the push action is aimed at acquire them.
 * @param game
 * @param remove
 * @param x
 * @param y
 * @param item
 */
export function push(game, remove, x, y, item) {
    const d = game.logic.getItemData(item);
    game.ui.popup('ITEM_ACQUIRED', d.icon, 'ITEMS.' + item + '.name');
    game.removeDecals(x, y);
    game.logic.addQuestItem(item);
    remove();
}