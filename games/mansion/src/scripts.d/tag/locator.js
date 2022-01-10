import Position from "libs/engine/Position";

/**
 * Déclaration d'une cellule en tant que locator.
 * Les locator permettent d'identifier une cellule afin de s'y référer plus tard
 * @param game {Game} instance du jeu
 * @param remove {function} fonction à appeler si l'on souhaite retirer le tag de la map
 * @param x {number} coordonnée x de la cellule ou se trouve le tag
 * @param y {number} coordonnée y de la cellule ou se trouve le tag
 * @param ref {string} référence (nom) du locator
 * @param angle {number} angle du locator (pour les spawn)
 */
export function init(game, remove, x, y, ref, angle = 0) {
    const p = game.engine.getCellCenter(x, y);
    const fAngle = 180 * angle / Math.PI;
    game._locators[ref] = {
        ref,
        cell: {x, y},
        position: new Position({x: p.x, y: p.y, z: 1, angle: fAngle})
    };
    remove();
}
