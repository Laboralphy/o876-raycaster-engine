import Position from "libs/engine/Position";

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