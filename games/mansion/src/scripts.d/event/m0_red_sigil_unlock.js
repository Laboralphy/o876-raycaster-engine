export function main(game) {
    // unlock sigils
  game.runScript('action.unlockDoor', 'red_sigil')
  game.runScript('action.unlockDoor', 'cyan_sigil')
  game.removeSense('m0_cyan_sigil');
}
