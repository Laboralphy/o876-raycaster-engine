export function main(game, remove, x, y) {
    game.runScript('actions.resolveClueUnlockSecret', 'clue_cyan_sigil', 1000);
    remove();   // supprimer le tag, qui ne doit servir qu'une fois.
}