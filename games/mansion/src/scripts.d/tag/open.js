// generic

export function enter(game, remove, xTag, yTag, doorTag) {
    const {x, y} = game.getLocator(doorTag).cell;
    game.engine.openDoor(x, y);
}

export function push(game, remove, xTag, yTag, doorTag) {
    const {x, y} = game.getLocator(doorTag).cell;
    game.engine.openDoor(x, y);
}