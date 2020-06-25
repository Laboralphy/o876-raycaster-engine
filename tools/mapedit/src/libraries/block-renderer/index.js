import CanvasHelper from "../../../../../libs/canvas-helper";
import * as CONSTS from "../../../../../libs/raycaster/consts";


const SIMILARITY_NONE = 0;
const SIMILARITY_OPPOSITE = 1;
const SIMILARITY_ALL = 2;

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
    try {
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
    } catch(e) {
        return CanvasHelper.createCanvas(1, 1);
    }
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
    c.lineWidth = 3;
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


function getSimilarities({n, e, w, s}) {
    const x = w === e;
    const y = n === s;
    if (x && y && n === w) {
        return SIMILARITY_ALL;
    }
    if (x && y) {
        return SIMILARITY_OPPOSITE;
    }
    return SIMILARITY_NONE;
}

/**
 * render a flat view of the block
 * in order to be display in the grid
 */
export async function render(oCanvas, phys, faces, light) {
    let w = oCanvas.width;
    let h = oCanvas.height;
    let c = oCanvas.getContext('2d');
    c.clearRect(0, 0, w, h);

    // drawing textures
    const sim = getSimilarities(faces);
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
            switch (sim) {
                case SIMILARITY_ALL:
                    await renderTile(oCanvas, faces.w, 1, 1, 0, 0);
                    break;

                case SIMILARITY_OPPOSITE:
                    await renderTile(oCanvas, faces.w, 0.5, 1, 0, 0);
                    await renderTile(oCanvas, faces.n, 0.5, 1, 0.5, 0);
                    break;

                default:
                    await renderTile(oCanvas, faces.w, 0.5, 0.5, 0, 0);
                    await renderTile(oCanvas, faces.n, 0.5, 0.5, 0.5, 0);
                    await renderTile(oCanvas, faces.s, 0.5, 0.5, 0, 0.5);
                    await renderTile(oCanvas, faces.e, 0.5, 0.5, 0.5, 0.5);
                    break;
            }
            break;

        case CONSTS.PHYS_TRANSPARENT_BLOCK:
        case CONSTS.PHYS_OFFSET_BLOCK:
        case CONSTS.PHYS_DOOR_UP:
        case CONSTS.PHYS_DOOR_DOWN:
        case CONSTS.PHYS_DOOR_LEFT:
        case CONSTS.PHYS_DOOR_RIGHT:
        case CONSTS.PHYS_DOOR_DOUBLE:
        case CONSTS.PHYS_CURT_DOWN:
        case CONSTS.PHYS_CURT_UP:
        case CONSTS.PHYS_SECRET_BLOCK:
            if (faces.c) {
                await renderCeil(oCanvas, 0.25, faces.c);
                await renderFloor(oCanvas, 0.25, faces.f);
                switch (sim) {
                    case SIMILARITY_ALL:
                        await renderTile(oCanvas, faces.w, 1, 0.5, 0, 0.25);
                        break;

                    case SIMILARITY_OPPOSITE:
                        await renderTile(oCanvas, faces.w, 0.5, 0.5, 0, 0.25);
                        await renderTile(oCanvas, faces.n, 0.5, 0.5, 0.5, 0.25);
                        break;

                    default:
                        await renderTile(oCanvas, faces.w, 0.5, 0.25, 0, 0.25);
                        await renderTile(oCanvas, faces.n, 0.5, 0.25, 0.5, 0.25);
                        await renderTile(oCanvas, faces.s, 0.5, 0.25, 0, 0.5);
                        await renderTile(oCanvas, faces.e, 0.5, 0.25, 0.5, 0.5);
                        break;
                }
            } else {
                await renderFloor(oCanvas, 0.25, faces.f);
                switch (sim) {
                    case SIMILARITY_ALL:
                        await renderTile(oCanvas, faces.w, 1, 0.75, 0, 0);
                        break;

                    case SIMILARITY_OPPOSITE:
                        await renderTile(oCanvas, faces.w, 0.5, 0.75, 0, 0);
                        await renderTile(oCanvas, faces.n, 0.5, 0.75, 0.5, 0);
                        break;

                    default:
                        await renderTile(oCanvas, faces.w, 0.5, 0.37, 0, 0);
                        await renderTile(oCanvas, faces.n, 0.5, 0.37, 0.5, 0);
                        await renderTile(oCanvas, faces.s, 0.5, 0.38, 0, 0.37);
                        await renderTile(oCanvas, faces.e, 0.5, 0.38, 0.5, 0.37);
                        break;
                }


            }
            break;
    }

    // drawing the color indications
    switch (phys) {
        case CONSTS.PHYS_NONE:
            break;

        case CONSTS.PHYS_WALL:
        case CONSTS.PHYS_INVISIBLE_BLOCK:
            c.lineWidth = 3;
            c.strokeStyle = 'rgb(255, 64, 64)';
            c.strokeRect(1, 1, w - 2, h - 2);
            c.strokeRect(5, 5, w - 10, h - 10);
            break;

        case CONSTS.PHYS_TRANSPARENT_BLOCK:
            c.lineWidth = 3;
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
        case CONSTS.PHYS_CURT_DOWN:
        case CONSTS.PHYS_CURT_UP:
            ornateDoorIcon(c, phys, w, h);
            break;

        case CONSTS.PHYS_SECRET_BLOCK:
            c.lineWidth = 3;
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
            c.lineWidth = 3;
            c.strokeStyle = 'rgb(255, 128, 0)';
            c.strokeRect(1, 1, w - 2, h - 2);
            c.beginPath();
            c.moveTo(1, 1);
            c.lineTo(w - 2, h - 2);
            c.stroke();
            break;
    }
    if (!!light) {
        c.lineWidth = 3;
        c.strokeStyle = 'rgb(255, 255, 255)';
        const pad = 2;
        const x0 = pad, x1 = w >> 1, x2 = w - pad;
        const y0 = pad, y1 = h >> 1, y2 = h - pad;

        c.beginPath();
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
            c.moveTo((w >> 4) * Math.cos(a) + x1, (w >> 4) * Math.sin(a) + y1);
            c.lineTo((w >> 1) * Math.cos(a) + x1, (w >> 1) * Math.sin(a) + y1);
        }
        c.stroke();
    }
    return oCanvas;
}
