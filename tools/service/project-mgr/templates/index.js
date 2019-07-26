import * as ASC from 'o876-raycaster-engine/lib/src/auto-stretch-canvas';

/**
 * Screen (canvas) initialization.
 * Will imbue specified canvas with auto-stretch capabilities.
 * @param oCanvas {HTMLCanvasElement}
 */
function initScreen(oCanvas) {
    ASC.setControlledCanvas(oCanvas);
}


function main() {
    const oScreen = document.querySelector('div.game canvas.screen');
    const oCtx = oScreen.getContext('2d');
    oCtx.fillStyle = 'blue';
    oCtx.fillRect(0, 0, 400, 250);
    initScreen(oScreen);
}