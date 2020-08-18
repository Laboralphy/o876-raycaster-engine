/*
verrouiller la porte
faire apparaitre un vengeful ghost
 */
export function main(game, remove, x, y) {
    const loc = game.locators['red_sigil_0'];
    const pos = loc.cell;
    game.engine.lockDoor(pos.x, pos.y, true);
    game.rotateDecals(pos.x, pos.y, false);
    const oGhost = game.spawnGhost('g_bashed_boy', 'spawn_red_sigil_0_ghost');
    remove();
}