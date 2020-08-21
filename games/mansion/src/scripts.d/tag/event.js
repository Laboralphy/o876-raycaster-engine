/*
Déclencher un évènement (un autre script)
 */


export function push(game, remove, x, y, ref, ...params) {
    game.runScript('event.' + ref, remove, x, y, ...params);
}

export function enter(game, remove, x, y, ref, ...params) {
    game.runScript('event.' + ref, remove, x, y, ...params);
}

