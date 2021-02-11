// book of glyphs has been taken
export function main(game, remove, x, y) {
    // lock door : no one escape this room until ghost is defeated
    game.runScript('action.lockDoor', 'red_sigil');
    // spawn vengeful ghost
    const oGhost = game.spawnGhost('g_bashed_boy_0', 'spawn_red_sigil_ghost');
    // when ghost is defeated : unlock the door
    oGhost.data.events.death = 'event.m0_red_sigil_unlock';
    // this event happens only once
    remove();
}
