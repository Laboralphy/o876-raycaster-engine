export function main(game, remove, x, y) {
    game.runScript('action.takeAmbientPhoto', 'm0_fire_place', 500);
    remove();
}