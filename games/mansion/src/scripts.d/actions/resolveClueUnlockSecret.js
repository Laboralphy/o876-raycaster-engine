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
    const block = game.locators[ref + '_target'].cell;
    game.engine.lockDoor(block.x, block.y, false);
    return game.runScript('actions.showRemotePlace', ref, score);
}
