import CanvasHelper from "libs/canvas-helper";

export async function keydown(game) {
    const aPhotos = game.album.prop('getPhotos');
    if (aPhotos.length > 1) {
        const p0 = await CanvasHelper.loadCanvas(aPhotos[0].image);
        const p1 = await CanvasHelper.loadCanvas(aPhotos[1].image);
        game.runScript('actions.photomog.main', p0, p1);
    }
}