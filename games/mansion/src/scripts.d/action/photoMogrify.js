import PhotoMogrify from "../../filters/PhotoMogrify";
import FadeOut from "libs/engine/filters/FadeOut";
import FadeIn from "libs/engine/filters/FadeIn";
import Link from "libs/engine/filters/Link";

const FADE_STYLE = 'rgba(0, 0, 0, 0.75)';

/**
 *
 * @param game
 * @param p0
 * @param p1
 * @returns {Promise<unknown>}
 */
function doMogrify(game, p0, p1) {
    return new Promise((resolve, reject) => {
        const oFadeOut = new FadeOut({color: FADE_STYLE, duration: 300});
        const oFadeIn = new FadeIn({color: FADE_STYLE, duration: 300});
        const oLink = new Link([oFadeOut, oFadeIn]);
        try {
            const oPhotoMog = new PhotoMogrify({src: p0, dst: p1, end: () => {
                resolve();
                oFadeOut.terminate();
            }});
            game.engine.filters.link(oLink);
            game.engine.filters.link(oPhotoMog);
            setTimeout(() => {
                game._audioManager.play('magic-chime-low')
            }, 2000)
        } catch (e) {
            oLink.terminate();
            reject(e);
        }
    })
}

/**
 * Transforme graduellement le canvas p0 en p1 avec un effet fantomatique
 * La fonction renvoie une promise car l'action est très longue.
 * @param game {Game}
 * @param p0 {HTMLCanvasElement}
 * @param p1 {HTMLCanvasElement}
 * @returns {Promise<void>}
 */
export async function main(game, p0, p1) {
    if (game.isCameraRaised()) {
        game.dropCamera();
    }
    game.freezePlayer();
    await doMogrify(game, p0, p1);
    game.thawPlayer();
}