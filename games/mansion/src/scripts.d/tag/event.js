/*
Déclencher un évènement (un autre script)
 */


export function push(game, remove, x, y, ref) {
    game.runScript('event.' + ref, remove, x, y);
}

export function enter(game, remove, x, y, ref) {
    game.runScript('event.' + ref, remove, x, y);
}

