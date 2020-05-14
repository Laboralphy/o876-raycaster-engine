/**
 * Script utilisé lorsque la photo prise doit permettre de débloquer un passage secret.
 * Avec révélation de l'endroit ou se trouve le bloc secret.
 * Ne fonctionne que pour les blocs secret, pas pour les portes : utiliser resolveClueUnlockDoor à la place
 * @param game
 * @param ref {string}
 * @param score {number}
 */
import GeometryHelper from "libs/geometry/GeometryHelper";

export async function main(game, ref, score = 0) {
    const CLUE_REF = 'clue_' + ref;
    const CLUE_REF_TARGET = CLUE_REF + '_target';
    const pos = game.locators[CLUE_REF].position;
    const target = game.locators[CLUE_REF_TARGET].position;
    const block = game.locators[CLUE_REF_TARGET].cell;
    game.rotateDecals(block.x, block.y, false);
    game.engine.lockDoor(block.x, block.y, false);
    pos.angle = GeometryHelper.angle(pos.x, pos.y, target.x, target.y);
    const p0 = game.capture();
    const p1 = game.storePhoto(
        'clues',                // type de photo
        score,                   // score de la photo
        CLUE_REF,      // information supplémentaire (titre, description)
        pos                     // position d'ou doit etre prise la photo
    );
    await game.runScript('actions.photoMogrify', p0, p1);
    await game.ui.popup('EVENT_PHOTO_MOGRIFIED', 'photo-mogrify');
    game.ui.popup('EVENT_PHOTO_STORED', 'album-clue', 'PHOTO_TYPES_CLUE');
}
