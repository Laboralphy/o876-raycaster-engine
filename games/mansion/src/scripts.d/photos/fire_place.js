export function main(game, remove, x, y) {
    game.runScript('actions.takeAmbientPhoto', 'fire_place', 500);
    remove();
}