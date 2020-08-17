/**
 * La photo doit faire place au passage secret
 * @param game
 * @param remove
 * @param x
 * @param y
 */

export function main(game, remove, x, y) {
    game.runScript('action.takeArtPhoto', 'w_cowled_skull', 1000);
    remove();   // supprimer le tag, qui ne doit servir qu'une fois.
}