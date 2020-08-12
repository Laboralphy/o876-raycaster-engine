/**
 * La photo doit faire place au passage secret
 * @param game
 * @param remove
 * @param x
 * @param y
 */

export function main(game, remove, x, y) {
    const block = game.locators.clue_skull_face_target.cell;
    game.rotateDecals(block.x, block.y, false);
    game.runScript('actions.resolveClueUnlockSecret', 'clue_skull_face', 1000);
    remove();   // supprimer le tag, qui ne doit servir qu'une fois.
}