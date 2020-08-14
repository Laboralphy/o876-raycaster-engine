import * as CONSTS from '../../consts';

/**
 * Initially locks a door tagged with "lock"
 * @param game {Game} game instance
 * @param remove {function} if called back, the tag is removed from the level.
 * @param x {number} cell door coordinates (x axis)
 * @param y {number} cell door coordinates (y axis)
 */
export function init(game, remove, x, y) {
    game.engine.lockDoor(x, y, true);
}

/**
 * This script will unlock a door if the player have the right unlocking item.
 * @param game
 * @param remove
 * @param x
 * @param y
 * @param key
 */
export function push(game, remove, x, y, key) {
    if (!!key && game.logic.hasQuestItem(key)) {
        remove(); // removes tag
        game.ui.popup('DOOR_UNLOCKED', 'unlock', 'ITEMS.' + key + '.name');
        game.removeDecals(x, y); // remove keyhole decal from door
        game.engine.lockDoor(x, y, false); // unlock door
    } else {
        // the door is simply locked without key
        // display message only if the cell is a door
        if (game.engine.isDoor(x, y)) {
            game.ui.popup('DOOR_LOCKED', 'keyhole');
        }
    }
}