export function main(game) {
    const loc = game.getLocator('red_sigil_0');
    const pos = loc.cell;
    game.engine.lockDoor(pos.x, pos.y, false);
    game.rotateDecals(pos.x, pos.y, true);
}