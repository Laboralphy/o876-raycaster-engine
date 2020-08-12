/**
 * Script utilisé lorsque la photo prise doit permettre de débloquer un passage secret.
 * Avec révélation de l'endroit ou se trouve le bloc secret.
 * @param game
 * @param ref {string}
 * @param score {number}
 */
import * as CONSTS from "../../consts";
import GeometryHelper from "libs/geometry/Helper";

export async function main(game, ref, score = 0) {
    // clue_ref et clue_ref_target sont deux position permettant de prendre une photo dans un autre lieu
    // cible de l'enigme
    const CLUE_REF = ref;
    const CLUE_REF_TARGET = CLUE_REF + '_target';
    const pos = game.locators[CLUE_REF].position;
    const target = game.locators[CLUE_REF_TARGET].position;
    const block = game.locators[CLUE_REF_TARGET].cell;
    pos.angle = GeometryHelper.angle(pos.x, pos.y, target.x, target.y);
    const p0 = game.capture();
    const p1 = game.storePhoto(
        CONSTS.PHOTO_TYPE_CLUE, // type de photo
        score,                  // score de la photo
        CLUE_REF,               // information supplémentaire (titre, description)
        pos                     // position d'ou doit etre prise la photo
    );
    await game.runScript('actions.photoMogrify', p0, p1);
    await game.ui.popup('EVENT_PHOTO_MOGRIFY', 'photo-mogrify');
    return game.ui.popup('EVENT_PHOTO_CLUE_STORED', 'album-clue');
}
