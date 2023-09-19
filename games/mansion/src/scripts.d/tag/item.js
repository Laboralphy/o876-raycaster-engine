import * as CONSTS from '../../consts'

function destroyItem (game, x, y, item) {
    const oItem = game
        .engine
        .horde
        .getEntitiesAt(x, y)
        .find(i => i._ref === item)
    if (oItem) {
        game.engine.destroyEntity(oItem)
    }
}

function addItemToInventory (game, item) {
    const d = game.logic.getItemData(item);
    game.soundEvent(CONSTS.AUDIO_EVENT_EXPLORE_PICKUP_ITEM, { item: d })
    game.ui.popup('EVENT_ITEM_ACQUIRED', d.icon, 'ITEMS.' + item + '.name');
    game.logic.addInventoryItem(item);
}

function addNoteToDocuments (game, item) {
    game.ui.popup('EVENT_ITEM_ACQUIRED', 'note', 'NOTES.' + item + '.title');
    game.soundEvent(CONSTS.AUDIO_EVENT_EXPLORE_PICKUP_ITEM, { item: { type: 'scroll' } })
    game.ui.addNote(item)
}

function pickupItemWall (game, x, y, item) {
    game.removeDecals(x, y);
    addItemToInventory(game, item)
}

function pickupNoteWall (game, x, y, item) {
    game.removeDecals(x, y);
    addNoteToDocuments(game, item)
}

function pickupNoteFloor (game, x, y, item) {
    destroyItem(game, x, y, item)
    addNoteToDocuments(game, item)
}


function pickupItemFloor (game, x, y, item) {
    destroyItem(game, x, y, item)
    addItemToInventory(game, item)
}

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
    switch (d.type) {
        case 'note': {
            pickupNoteWall(game, x, y, item)
            pickupNoteFloor(game, x, y, item)
            break
        }
        default: {
            pickupItemWall(game, x, y, item)
            pickupItemFloor(game, x, y, item)
            break
        }
    }
    remove();
}

export function enter(game, remove, x, y, item) {
    const d = game.logic.getItemData(item);
    switch (d.type) {
        case 'note': {
            pickupNoteFloor(game, x, y, item)
            break
        }
        default: {
            pickupItemFloor(game, x, y, item)
            break
        }
    }
    remove();
}
