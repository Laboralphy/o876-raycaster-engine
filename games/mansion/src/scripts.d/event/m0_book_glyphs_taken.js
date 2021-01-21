/*
verrouiller la porte
faire apparaitre un vengeful ghost
 */
export function main(game, remove, x, y) {
    game.runScript('action.lockDoor', 'red_sigil');
    const oGhost = game.spawnGhost('g_bashed_boy', 'spawn_red_sigil_ghost');
    oGhost.data.events.death = 'event.m0_red_sigil_unlock';
    remove();
}
