import { getPhotoScore } from './get-photo-score'
/**
 * Une photo de tableau artistique
 * @param game
 * @param remove
 * @param x
 * @param y
 * @param paintRef {string}
 * @param score
 */

export function main(game, remove, x, y, paintRef, score) {
    game.runScript('action.takeArtPhoto', paintRef, getPhotoScore(score));
    remove();   // supprimer le tag, qui ne doit servir qu'une fois.
}