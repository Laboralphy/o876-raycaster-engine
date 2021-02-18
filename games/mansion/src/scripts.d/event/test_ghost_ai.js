export function main (game, remove, x, y) {
    console.log('spawning test ghost')
    game.spawnGhost('g_test', 'g_spawnpoint');
    remove();
}