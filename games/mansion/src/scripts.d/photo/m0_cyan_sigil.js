export function main(game, remove, x, y) {
    game.runScript('action.resolveClueUnlockSecret', 'm0_cyan_sigil', 1000);
    remove();   // supprimer le tag, qui ne doit servir qu'une fois.
}