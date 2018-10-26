// main

import rclib from '../../src';

const {TileSet, ShadedTileSet, CanvasHelper, Raycaster, CONSTS} = rclib;


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
    let cBG = await CanvasHelper.loadCanvas('textures/sky.png');
    CanvasHelper.setImageSmoothing(cvs, false);
    CanvasHelper.setImageSmoothing(cWall, false);

    let rc = new Raycaster();
    rc.setWallTextures(cWall, 96, 64);
    rc.setBackground(cBG);
    rc.setVisualSettings('black', false, 0.2);
    rc.setMapSize(30);
    rc.registerCellCode(0, {n: null, e: null, s: null, w: null, f: null, c: null});
    rc.registerCellCode(1, {n: 0, e: 0, s: 0, w: 0, f: null, c: null});
    rc.registerCellCode(2, {n: 1, e: 1, s: 1, w: 1, f: null, c: null});
    rc.registerCellCode(3, {n: 4, e: 4, s: 4, w: 4, f: null, c: null});
    for (let y = 0; y < 20; ++y) {
        for (let x = 0; x < 10; ++x) {
            rc.setCellCode(x, y, 1);
            rc.setCellPhys(x, y, 1);
            rc.setCellCode(x + 9, y, 1);
            rc.setCellPhys(x + 9, y, 1);
        }
    }
    for (let y = 1; y < 19; ++y) {
        for (let x = 1; x < 9; ++x) {
            rc.setCellCode(x, y, 0);
            rc.setCellPhys(x, y, 0);
            rc.setCellCode(x + 9, y, 0);
            rc.setCellPhys(x + 9, y, 0);
        }
    }
    rc.setCellCode(9, 3, 2);
    rc.setCellPhys(9, 3, CONSTS.PHYS_DOOR_SLIDING_DOUBLE);
    rc.setCellOffset(9, 3, 10);

    rc.setCellCode(9, 5, 3);
    rc.setCellPhys(9, 5, CONSTS.PHYS_TRANSPARENT_BLOCK);
    rc.setCellOffset(9, 5, 32);

    rc.setCellCode(4, 0, 3);
    rc.setCellPhys(4, 0, CONSTS.PHYS_TRANSPARENT_BLOCK);
    rc.setCellOffset(4, 0, 32);

    let f = Math.PI / 4;
    function doomloop() {
        f -= 0.01;
        rc.computeScreenSliceBuffer(256, 256, f);
        ctx.clearRect(0, 0, 800, 600);
        rc.render(ctx);
    }

    setInterval(doomloop, 40);
}

window.addEventListener('load', main);
