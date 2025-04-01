export function main(game, remove, x, y) {
    game.runScript('action.spawnWraith', 'w_unfortunate_investigator', 'wraith_investigator_1', 5000, 1000);
    remove();
}