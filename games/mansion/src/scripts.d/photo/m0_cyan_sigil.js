const CONSTS = require('../../consts');
export function main(game, remove, x, y) {
    // si le joueur n'a pas le livre des glyphs
    if (!game.logic.hasQuestItem('book_glyphs')) {
        game.runScript('action.showRemotePlace', 'm0_book_glyphs', CONSTS.PHOTO_SCORE_COMMON);
    }
    game.removeSense('m0_cyan_sigil');
    remove();   // supprimer le tag, qui ne doit servir qu'une fois.
}