/*
    On essaye de quitter la remise :
    1) verrouiller la cabane
    2) faire apparaitre un vengeful va apparaitre
 */
export function main(game, remove, x, y) {
    if (game.player.sector.y > y) {
        // pas du bon coté du tag
        return;
    }
    game.runScript('action.lockDoor', 'door_remise')
    game.runScript('action.spawnWraith', 'w_cowled_skull', 'wraith_skull_face', 5000, 1000);
    remove();
}