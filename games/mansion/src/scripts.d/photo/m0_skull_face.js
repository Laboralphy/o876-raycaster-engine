const CONSTS = require('../../consts')
/**
 * La photo doit faire place au passage secret
 * @param game
 * @param remove
 * @param x
 * @param y
 */

export function main(game, remove, x, y) {
    game.runScript('action.takeArtPhoto', 'p_cowled_skull', CONSTS.PHOTO_SCORE_COMMON);
    remove();   // supprimer le tag, qui ne doit servir qu'une fois.
}