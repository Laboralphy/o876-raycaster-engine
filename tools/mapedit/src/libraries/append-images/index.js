import CanvasHelper from "../../../../../src/canvas-helper";

/**
 * Combine plusieurs tiles en une seule et renvoie les data-images
 * @param tilesets {array}
 * @param iStart
 * @param count
 * @return {Promise<*>}
 */
export async function appendImages(tilesets, iStart, count) {
    // déterminer la liste des frames à recombiner
    const aAllTiles = [];
    for (let i = 0; i < count; ++i) {
        aAllTiles.push(tilesets[iStart + i].content);
    }
    const proms = aAllTiles.map(t => CanvasHelper.loadCanvas(t));
    const aCanvases = await Promise.all(proms);
    if (aCanvases.length === 0) {
        throw new Error('no tile defined');
    }
    const w = aCanvases[0].width;
    const h = aCanvases[0].height;
    const cvsOutput = CanvasHelper.createCanvas(w * count, h);
    const ctxOutput = cvsOutput.getContext('2d');
    for (let i = 0; i < count; ++i) {
        ctxOutput.drawImage(aCanvases[i], i * w, 0);
    }
    return {
        src: CanvasHelper.getData(cvsOutput),
        width: w | 0,
        height: h | 0
    };
}


