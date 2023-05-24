export function main(game, remove, x, y) {
    game.runScript('action.spawnWraith', 'w_walkingaway_cultist', 'wraith_cultist_lootbag', 5000, 1000);
    remove();
}