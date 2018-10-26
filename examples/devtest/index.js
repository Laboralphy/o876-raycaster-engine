// main

import rclib from '../../src';

const {TileSet, ShadedTileSet, CanvasHelper, Raycaster} = rclib;


async function main2() {
	let cvs = document.querySelector('canvas');
	let ctx = cvs.getContext('2d');
	let cWall = await CanvasHelper.loadCanvas('textures/walls.png');
	let ts = new TileSet();
	ts.setTileWidth(64);
	ts.setTileHeight(96);
	ts.setImage(cWall); 
	let sts = new ShadedTileSet();
	sts.setTileSet(ts);
	sts.compute('#000000', '#808080', 0);
	let sts2 = sts.createFragment(3);
    ctx.drawImage(sts2._tileSets[0].getImage(), 0, 0);
    ctx.drawImage(sts2._tileSets[4].getImage(), 64, 96);
}


async function main() {
    let cvs = document.querySelector('canvas');
    let ctx = cvs.getContext('2d');
    let cWall = await CanvasHelper.loadCanvas('textures/walls.png');
    CanvasHelper.setImageSmoothing(cvs, false);
    CanvasHelper.setImageSmoothing(cWall, false);

    let rc = new Raycaster();
    rc.setWallTextures(cWall, 96, 64);
    rc.setVisualSettings('black', false, 0);
    rc.setMapSize(30);
    rc.registerCellCode(0, {n: null, e: null, s: null, w: null, f: null, c: null});
    rc.registerCellCode(1, {n: 0, e: 0, s: 0, w: 0, f: null, c: null});
    for (let y = 0; y < 20; ++y) {
        for (let x = 0; x < 10; ++x) {
            rc.setCellCode(x, y, 1);
            rc.setCellPhys(x, y, 1);
        }
    }
    for (let y = 1; y < 19; ++y) {
        for (let x = 1; x < 9; ++x) {
            rc.setCellCode(x, y, 0);
            rc.setCellPhys(x, y, 0);
        }
    }
    let zb = rc.computeScreenSliceBuffer(256, 256, 0);
    Raycaster.renderScreenSliceBuffer(zb, ctx);
}

window.addEventListener('load', main);
