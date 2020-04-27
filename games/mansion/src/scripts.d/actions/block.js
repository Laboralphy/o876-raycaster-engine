/**
 * This script is run when a SECRET block is encountered during initialization phase.
 * It locks the block (much like a regular door) which the tag is applied to.
 * The main different is that a secret locked block has no keyhole.
 * When a script want to unlock a block, a distinctive marks appears on the secret block to reveal its true nature.
 * @param game
 * @param remove
 * @param x
 * @param y
 */
export function init(game, remove, x, y) {
    game.engine.lockDoor(x, y, true);
}