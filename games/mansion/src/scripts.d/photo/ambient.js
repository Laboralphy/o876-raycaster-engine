import { getPhotoScore } from './get-photo-score'

export function main(game, remove, x, y, paintRef, score) {
    game.runScript('action.takeAmbientPhoto', paintRef, getPhotoScore(score));
    game.removeSense(paintRef);
    remove();
}
