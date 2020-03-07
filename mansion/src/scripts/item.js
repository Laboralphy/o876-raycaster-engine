export function push(game, remove, x, y, item) {
    const d = game.logic.getItemData(item);
    game.ui.popup('ITEM_ACQUIRED', d.icon, item);
    game.removeDecals(x, y);
    game.logic.addQuestItem(item);
    remove();
}