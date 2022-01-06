import Flash from "libs/engine/filters/Flash";

export function main(game, remove, x, y) {
    const oFlash = new Flash({duration: 2500, strength: 2});
    game.engine.filters.link(new Flash({duration: 250, strength: 5}));
    game.engine.delayCommand(() => game.engine.filters.link(oFlash), 250);
    remove();
}