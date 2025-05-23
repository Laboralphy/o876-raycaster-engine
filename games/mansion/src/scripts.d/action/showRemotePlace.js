/**
 * Révélation d'un l'endroit ou se trouve un indice secret.
 * il faut un tag locator clue_* et un tag locator clue_*_target
 * La visor sera placée sur clue_* et fixera le point du locator clue_*_target
 * @param game
 * @param ref {string}
 * @param score {number}
 */
import * as CONSTS from "../../consts";
import GeometryHelper from "libs/geometry";

export async function main(game, ref, score = 0) {
    // clue_ref et clue_ref_target sont deux position permettant de prendre une photo dans un autre lieu
    // cible de l'enigme
    const refTarget = ref + '_target';
    const pos = game.getLocator(ref).position;
    const target = game.getLocator(refTarget).position;
    pos.angle = GeometryHelper.angle(pos.x, pos.y, target.x, target.y);
    const p0 = game.capture();
    const p1 = game.storePhoto(
        CONSTS.PHOTO_TYPE_CLUE, // type de photo
        score,                  // score de la photo
        ref,                    // information supplémentaire (titre, description)
        pos                     // position d'ou doit etre prise la photo
    );
    await game.runScript('action.photoMogrify', p0, p1);
    await game.ui.popup('EVENT_PHOTO_MOGRIFY', 'photo-mogrify');
    return game.ui.popup('EVENT_PHOTO_CLUE_STORED', 'album-clue');
}
