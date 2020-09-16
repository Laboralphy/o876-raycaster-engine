import Position from "libs/engine/Position";

/**
 * Déclaration d'un point de sensibilité surnaturelle
 * @param game
 * @param remove
 * @param x
 * @param y
 * @param ref
 * @param angle
 */
export function init(game, remove, x, y, ref, angle = 0) {
    game.logic.addSupernaturalBeacon(ref, x, y);
    remove();
}