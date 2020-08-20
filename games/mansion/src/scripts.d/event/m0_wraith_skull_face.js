/*
faire apparaitre le wraith mais uniquement si la photo correspondant à été prise et si on est du bon coté de la porte
 */
export function main(game, remove, x, y) {
    if (!game.album.hasTakenPhoto('m0_bloody_deadend')) {
        // ne possède pas encore la photo
        return;
    }
    if (game.player.sector.x > x) {
        // pas du bon coté du tag
        return;
    }
    game.runScript('action.spawnWraith', 'w_cowled_skull', 'wraith_skull_face', 5000, 1000);
    remove();
}