/**
 * Script utilisé lorsque la photo prise doit permettre de débloquer un passage secret.
 * Avec révélation de l'endroit ou se trouve le bloc secret.
 * @param game
 * @param ref {string} commence par "clue_" (convention de nommage) par exemple clue_skull_mask
 * @param score {number} score attribuer pour cet indice
 */

export async function main(game, ref, score = 0) {
    // clue_ref et clue_ref_target sont deux position permettant de prendre une photo dans un autre lieu
    // cible de l'enigme
    const refTarget = ref + '_target';
    const block = game.getLocator(refTarget).cell;
    game.engine.lockDoor(block.x, block.y, false);
    // fait apparaitre une marque permettant de reconnaitre le block secret
    game.rotateDecals(block.x, block.y, false);
    // prend la photo
    return game.runScript('action.showRemotePlace', ref, score);
}
