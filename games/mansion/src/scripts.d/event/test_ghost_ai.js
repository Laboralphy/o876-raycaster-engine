export function main (game, remove, x, y) {
    console.log('spawning test ghost g_test_2')
    game.spawnGhost('g_test_2', 'g_spawnpoint');
    remove();
}