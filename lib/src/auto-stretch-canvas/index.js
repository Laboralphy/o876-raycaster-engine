/**
 * ScreenControl
 *
 * @description This module provides auto-stretch capabilities to canvases.
 * Auto-Stretching : the canvas will auto stretch to occupy the greatest possible screen space, but keep its aspect ratio
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
        CANVAS = null;
        window.removeEventListener('resize', screenResized);
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
    const UNIT = 'px';
    const PADDING = 24;
    let h = innerHeight;
    let w = innerWidth;
    const r = (h - PADDING) / w;
    const oCanvas = CANVAS;
    const ch = oCanvas.height;
    const cw = oCanvas.width;
    const rBase = ch / cw;
    let wf, hf;
    // to avoid screen overflow, we will determine the innermost dimension (either with or height)
    if (r < rBase) { // use the height (innermost)
        h -= PADDING;
        hf = h;
        wf = h * cw / ch;
    } else { // use the width (innermost)
        wf = w;
        hf = w * ch / cw;
    }
    // canvas style is being updated
    oCanvas.style.width = (wf | 0).toString() + UNIT;
    oCanvas.style.height = (hf | 0).toString() + UNIT;
    oCanvas.__aspect = wf / cw; // we save aspect ratio
    if (oCanvas.style.position === 'absolute' && oCanvas.style['margin-left'] === 'auto') {
        oCanvas.style.left = ((w - wf) >> 1 | 0).toString() + UNIT;
    }
}
