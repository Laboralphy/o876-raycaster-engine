import CanvasHelper from "../../../../../src/canvas-helper";
import * as CONSTS from "../../../../../src/raycaster/consts";

/**
 * Render a wall tile with a streching factor
 * @param oCanvas canvas to be rendered on
 * @param sContent
 * @param xStretch stretch factor value between 0 and 1 (0.25 or 1 usually)
 * @param yStretch
 * @param xOffset
 * @param yOffset
 */
async function renderTile(oCanvas, sContent, xStretch, yStretch, xOffset, yOffset) {
    const w = oCanvas.width;
    const h = oCanvas.height;
    const c = oCanvas.getContext('2d');
    const wFinal = w * xStretch | 0;
    const hFinal = h * yStretch | 0;
    const xFinal = w * xOffset | 0;
    const yFinal = h * yOffset | 0;
    const oSrc = await CanvasHelper.loadCanvas(sContent);
    if (oSrc) {
        c.drawImage(oSrc,
            0, 0, oSrc.width, oSrc.height,
            xFinal, yFinal, wFinal, hFinal
        );
    }
    c.strokeStyle = '#000000';
    c.strokeRect(xFinal, yFinal, wFinal, hFinal);
    return oCanvas;
}



/**
 * Render a floor tile with a streching factor
 * @param oCanvas canvas to be rendered on
 * @param fStretch streatch factor value between 0 and 1 (0.25 or 1 usually)
 */
function renderFloor(oCanvas, fStretch, sContent) {
    return renderTile(oCanvas, sContent, 1, fStretch, 0, 1 - fStretch);
}

/**
 * Render a ceil tile with a streching factor
 * @param oCanvas canvas to be rendered on
 * @param fStretch streatch factor value between 0 and 1 (0.25 or 1 usually)
 */
function renderCeil(oCanvas, fStretch, sContent) {
    return renderTile(oCanvas, sContent, 1, fStretch, 0, 0);
}


/**
 * Renders additional marks on doors to indicates how the door opens
 */
function ornateDoorIcon(c, phys, w, h) {
    let wLeft = 1;
    let wCenter = w >> 1;
    let wRight = w - wLeft;
    let hTop = h >> 2;
    let hCenter = h >> 1;
    let hBottom = h - hTop;

    c.strokeStyle = 'rgb(0, 255, 96)';
    c.strokeRect(1, 1, w - 2, h - 2);
    c.beginPath();

    switch (phys) {
        case CONSTS.PHYS_CURT_UP:
        case CONSTS.PHYS_DOOR_UP:
            c.moveTo(wCenter, hTop);
            c.lineTo(wRight, hBottom);
            c.lineTo(wLeft, hBottom);
            c.lineTo(wCenter, hTop);
            break;

        case CONSTS.PHYS_CURT_DOWN:
        case CONSTS.PHYS_DOOR_DOWN:
            c.moveTo(wCenter, hBottom);
            c.lineTo(wLeft, hTop);
            c.lineTo(wRight, hTop);
            c.lineTo(wCenter, hBottom);
            break;

        case CONSTS.PHYS_DOOR_LEFT:
            c.moveTo(wLeft, hCenter);
            c.lineTo(wRight, hTop);
            c.lineTo(wRight, hBottom);
            c.lineTo(wLeft, hCenter);
            break;

        case CONSTS.PHYS_DOOR_RIGHT:
            c.moveTo(wRight, hCenter);
            c.lineTo(wLeft, hTop);
            c.lineTo(wLeft, hBottom);
            c.lineTo(wRight, hCenter);
            break;

        case CONSTS.PHYS_DOOR_DOUBLE:
            c.moveTo(wCenter, hBottom);
            c.lineTo(wRight, hCenter);
            c.lineTo(wCenter, hTop);
            c.lineTo(wCenter, hBottom);
            c.lineTo(wLeft, hCenter);
            c.lineTo(wCenter, hTop);
            break;

    }
    c.stroke();
}


/**
 * render a flat view of the block
 * in order to be display in the grid
 */
export async function render(oCanvas, phys, faces) {
    let w = oCanvas.width;
    let h = oCanvas.height;
    let c = oCanvas.getContext('2d');
    c.clearRect(0, 0, w, h);

    // drawing textures
    switch (phys) {
        case CONSTS.PHYS_NONE:
        case CONSTS.PHYS_INVISIBLE_BLOCK:
            if (faces.c) {
                await renderCeil(oCanvas, 0.5, faces.c);
                await renderFloor(oCanvas, 0.5, faces.f);
            } else {
                await renderFloor(oCanvas, 1, faces.f);
            }
            break;

        case CONSTS.PHYS_WALL:
            await renderTile(oCanvas, faces.w, 0.5, 0.5, 0, 0);
            await renderTile(oCanvas, faces.n, 0.5, 0.5, 0.5, 0);
            await renderTile(oCanvas, faces.s, 0.5, 0.5, 0, 0.5);
            await renderTile(oCanvas, faces.e, 0.5, 0.5, 0.5, 0.5);
            break;

        case CONSTS.PHYS_TRANSPARENT_BLOCK:
        case CONSTS.PHYS_OFFSET_BLOCK:
        case CONSTS.PHYS_DOOR_UP:
        case CONSTS.PHYS_DOOR_DOWN:
        case CONSTS.PHYS_DOOR_LEFT:
        case CONSTS.PHYS_DOOR_RIGHT:
        case CONSTS.PHYS_DOOR_DOUBLE:
        case CONSTS.PHYS_DOOR_D:
        case CONSTS.PHYS_DOOR_E:
        case CONSTS.PHYS_DOOR_F:
        case CONSTS.PHYS_CURT_DOWN:
        case CONSTS.PHYS_CURT_UP:
        case CONSTS.PHYS_SECRET_BLOCK:
            if (faces.c) {
                await renderCeil(oCanvas, 0.25, faces.c);
                await renderFloor(oCanvas, 0.25, faces.f);
                await renderTile(oCanvas, faces.w, 0.5, 0.25, 0, 0.25);
                await renderTile(oCanvas, faces.n, 0.5, 0.25, 0.5, 0.25);
                await renderTile(oCanvas, faces.s, 0.5, 0.25, 0, 0.5);
                await renderTile(oCanvas, faces.e, 0.5, 0.25, 0.5, 0.5);
            } else {
                await renderFloor(oCanvas, 0.25, faces.f);
                await renderTile(oCanvas, faces.w, 0.5, 0.37, 0, 0);
                await renderTile(oCanvas, faces.n, 0.5, 0.37, 0.5, 0);
                await renderTile(oCanvas, faces.s, 0.5, 0.38, 0, 0.37);
                await renderTile(oCanvas, faces.e, 0.5, 0.38, 0.5, 0.37);
            }
            break;
    }

    // drawing the color indications
    switch (phys) {
        case CONSTS.PHYS_NONE:
            break;

        case CONSTS.PHYS_WALL:
        case CONSTS.PHYS_INVISIBLE_BLOCK:
            c.strokeStyle = 'rgb(255, 128, 0)';
            c.strokeRect(1, 1, w - 2, h - 2);
            break;

        case CONSTS.PHYS_TRANSPARENT_BLOCK:
            c.strokeStyle = 'rgb(255, 0, 255)';
            c.strokeRect(1, 1, w - 2, h - 2);
            c.beginPath();
            c.moveTo(1, 1);
            c.lineTo(w - 2, h - 2);
            c.stroke();
            break;

        case CONSTS.PHYS_DOOR_UP:
        case CONSTS.PHYS_DOOR_DOWN:
        case CONSTS.PHYS_DOOR_LEFT:
        case CONSTS.PHYS_DOOR_RIGHT:
        case CONSTS.PHYS_DOOR_DOUBLE:
        case CONSTS.PHYS_DOOR_D:
        case CONSTS.PHYS_DOOR_E:
        case CONSTS.PHYS_DOOR_F:
        case CONSTS.PHYS_CURT_DOWN:
        case CONSTS.PHYS_CURT_UP:
            ornateDoorIcon(c, phys, w, h);
            break;

        case CONSTS.PHYS_SECRET_BLOCK:
            c.strokeStyle = 'rgb(255, 255, 0)';
            c.strokeRect(1, 1, w - 2, h - 2);
            c.beginPath();
            c.moveTo(w >> 2, h >> 2);
            c.bezierCurveTo(w >> 2, 1, w - 1, 1, w >> 1, h >> 1);
            c.lineTo(w >> 1, (h >> 1) + (h >> 2));
            let nRadius = w / 24 | 0;
            c.moveTo((w >> 1) + nRadius, h - (h >> 3));
            c.arc(w >> 1, h - (h >> 3), nRadius, 0, Math.PI * 2);
            c.stroke();
            break;

        case CONSTS.PHYS_OFFSET_BLOCK:
            c.strokeStyle = 'rgb(255, 128, 0)';
            c.strokeRect(1, 1, w - 2, h - 2);
            c.beginPath();
            c.moveTo(1, 1);
            c.lineTo(w - 2, h - 2);
            c.stroke();
            break;
    }
    return oCanvas;
}
