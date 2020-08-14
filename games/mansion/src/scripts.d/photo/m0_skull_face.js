/**
 * La photo doit faire place au passage secret
 * @param game
 * @param remove
 * @param x
 * @param y
 */

export function main(game, remove, x, y) {
    game.runScript('action.resolveClueUnlockSecret', 'm0_bloody_deadend', 1000);
    remove();   // supprimer le tag, qui ne doit servir qu'une fois.
}