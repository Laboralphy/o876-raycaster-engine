const CONSTS = require('../../consts')

export function main(game, remove, x, y) {
    game.runScript('action.takeAmbientPhoto', 'm0_fire_place', CONSTS.PHOTO_SCORE_UNCOMMON);
    remove();
}