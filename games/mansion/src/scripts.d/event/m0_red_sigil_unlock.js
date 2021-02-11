export function main(game) {
  // unlock sigils
  game.runScript('action.unlockDoor', 'red_sigil')
  game.runScript('action.unlockDoor', 'cyan_sigil')
  // the mysterious force has vanished
  game.removeSense('m0_cyan_sigil');
}
