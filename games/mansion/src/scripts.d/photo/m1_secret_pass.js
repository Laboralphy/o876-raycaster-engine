const CONSTS = require('../../consts')

export function main(game, remove, x, y) {
    game.runScript('action.showRemotePlace', 'clue_m1_secret_pass', CONSTS.PHOTO_SCORE_COMMON);
    game.removeSense('m1_secret_pass');
    remove();
}