/*
un vengeful va apparaitre
 */
export function main(game, remove, x, y) {
    if (game.player.sector.x > x) {
        // pas du bon coté du tag
        return;
    }
    game.runScript('action.spawnWraith', 'w_cowled_skull', 'wraith_skull_face', 5000, 1000);
    remove();
}