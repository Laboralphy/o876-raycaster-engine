/**
 * ScreenControl
 *
 * @description This module provides control over canvases.
 * Auto-Stretching : the canvas will auto stretch to occupy the greatest possible screen space
 *
 * @author Raphaël Marandet
 * @email raphael.marandet(at)gmail(dot)com
 * @date 2019-06-13
 */

let CANVAS = null;


/**
 * Sets a canvas to auto-stretch to the innermost limit of the screen, keeping the aspect ratio
 * @param oCanvas {HTMLCanvasElement|null} the canvas. If null is passed the event listenner is cleared.
 */
export function setControlledCanvas(oCanvas) {
    if (CANVAS !== null) {
        window.removeEventListener('resize', screenResized);
        CANVAS = null;
    }
    if (oCanvas !== null) {
        CANVAS = oCanvas;
        window.addEventListener('resize', screenResized);
    }
}

/**
 * This is a handler for the 'resize' event.
 * @param oEvent {Event}
 */
export function screenResized(oEvent) {
    const PADDING = 24;
    let h = innerHeight;
    let w = innerWidth;
    const r = (h - PADDING) / w;
    const oCanvas = CANVAS;
    const ch = oCanvas.height;
    const cw = oCanvas.width;
    const rBase = ch / cw;
    let wf, hf;
    if (r < rBase) { // use the height (innermost)
        h -= PADDING;
        hf = h;
        wf = h * cw / ch;
    } else { // use the width (innermost)
        wf = w;
        hf = w * ch / cw;
    }
    oCanvas.style.width = (wf | 0).toString() + 'px';
    oCanvas.style.height = (hf | 0).toString() + 'px';
    oCanvas.__aspect = wf / cw;
    if (oCanvas.style.position === 'absolute' && oCanvas.style['margin-left'] === 'auto') {
        oCanvas.style.left = ((w - wf) >> 1 | 0).toString() + 'px';
    }
}

function setupPointerlock() {
    var PL = MAIN.pointerlock = new O876_Raycaster.PointerLock();
    if (MAIN.config.game.fpsControl && PL.init()) {
        MAIN.screen.addEventListener('click', function(oEvent) {
            MAIN.lockPointer();
        });
    }
}

/**
 * Entre en mode pointerlock
 * @param oElement
 * @returns {Boolean}
 */
function lockPointer() {
    var G = MAIN.game;
    var rc = G.oRaycaster;
    var oElement = MAIN.screen; // précédemment : rc.getScreenCanvas();
    var rcc = rc.oCamera;
    var rcct = rcc.oThinker;
    if (!rcc || !rcct) {
        return false;
    }
    if (MAIN.pointerlock.locked()) {
        return false;
    }
    if (MAIN.config.game.fullScreen) {
        O876_Raycaster.FullScreen.changeEvent = function(e) {
            if (O876_Raycaster.FullScreen.isFullScreen()) {
                MAIN.pointerlock.requestPointerLock(oElement);
                //MAIN.pointerlock.on('mousemove', G.oRaycaster.oCamera.oThinker.readMouseMovement.bind(G.oRaycaster.oCamera.oThinker));
            }
        };
        O876_Raycaster.FullScreen.enter(oElement);
    } else {
        MAIN.pointerlock.requestPointerLock(oElement);
        //MAIN.pointerlock.on('mousemove', rcct.readMouseMovement.bind(rcct));
    }
    return true;
}

