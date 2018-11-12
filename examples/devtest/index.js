// main

import rclib from '../../src';

const {ShadedTileSet, CanvasHelper, Renderer, CONSTS} = rclib;


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
	let sts2 = sts.extractTile(3);
    ctx.drawImage(sts2._tileSets[0].getImage(), 0, 0);
    ctx.drawImage(sts2._tileSets[4].getImage(), 64, 96);
}





async function main() {
    CanvasHelper.setDefaultImageSmoothing(false);
    let cvs = document.querySelector('canvas');
    let ctx = cvs.getContext('2d');
    CanvasHelper.setImageSmoothing(cvs, false);
    if (CanvasHelper.getImageSmoothing(cvs)) {
        console.error(cvs, 'is bugged');
    }
    let cWall = await CanvasHelper.loadCanvas('textures/walls.png');
    let cFlat = await CanvasHelper.loadCanvas('textures/flats.png');
    let cBG = await CanvasHelper.loadCanvas('textures/sky.png');

    // il nous faut un objet de configuration


    let rc = new Renderer();
    const upper = rc.createUpperLevel();
    rc.setWallTextures(cWall);
    rc.setFlatTextures(cFlat);
    rc.setBackground(cBG);
    rc.setMapSize(30);
    rc.registerCellTexture(0, {n: null, e: null, s: null, w: null, f: 0, c: 2});
    rc.registerCellTexture(1, {n: 0, e: 0, s: 0, w: 0, f: null, c: null});
    rc.registerCellTexture(2, {n: 1, e: 1, s: 1, w: 1, f: 0, c: 2});
    rc.registerCellTexture(3, {n: 4, e: 4, s: 4, w: 4, f: 0, c: 2});
    rc.registerCellTexture(4, {n: 0, e: 1, s: 2, w: 3, f: 0, c: 2});
    let oAnim = rc.createAnimation(5, 5, 160, CONSTS.ANIM_LOOP_FORWARD);
    rc.registerCellTexture(5, {n: oAnim, e: oAnim, s: oAnim, w: oAnim, f: null, c: null});
    rc.registerCellTexture(6, {n: null, e: null, s: null, w: null, f: 0, c: null});

    for (let y = 0; y < 20; ++y) {
        for (let x = 0; x < 10; ++x) {
            rc.setCellTexture(x, y, 1);
            rc.setCellPhys(x, y, 1);
            rc.setCellTexture(x + 9, y, 1);
            rc.setCellPhys(x + 9, y, 1);

            upper.setCellTexture(x, y, 1);
            upper.setCellPhys(x, y, 1);
            upper.setCellTexture(x + 9, y, 1);
            upper.setCellPhys(x + 9, y, 1);
        }
    }
    for (let y = 1; y < 19; ++y) {
        for (let x = 1; x < 9; ++x) {
            rc.setCellTexture(x, y, 0);
            rc.setCellPhys(x, y, 0);
            rc.setCellTexture(x + 9, y, 0);
            rc.setCellPhys(x + 9, y, 0);

            upper.setCellTexture(x, y, 0);
            upper.setCellPhys(x, y, 0);
            upper.setCellTexture(x + 9, y, 0);
            upper.setCellPhys(x + 9, y, 0);
        }
    }
    rc.setCellTexture(9, 3, 2);
    rc.setCellPhys(9, 3, CONSTS.PHYS_DOOR_SLIDING_DOUBLE);
    rc.setCellOffset(9, 3, 10);

    rc.setCellTexture(9, 5, 3);
    rc.setCellPhys(9, 5, CONSTS.PHYS_TRANSPARENT_BLOCK);
    rc.setCellOffset(9, 5, 32);

    rc.setCellTexture(4, 0, 3);
    rc.setCellPhys(4, 0, CONSTS.PHYS_TRANSPARENT_BLOCK);
    rc.setCellOffset(4, 0, 32);

    rc.setCellTexture(2, 2, 5);
    rc.setCellPhys(2, 2, CONSTS.PHYS_TRANSPARENT_BLOCK);

    rc.setCellTexture(5, 5, 6);
    rc.setCellTexture(6, 5, 6);

    rc.setCellTexture(5, 6, 6);
    rc.setCellTexture(6, 6, 6);


    upper.setCellTexture(4, 4, 1);
    upper.setCellTexture(5, 4, 1);
    upper.setCellTexture(6, 4, 1);
    upper.setCellTexture(7, 4, 1);

    upper.setCellTexture(4, 5, 1);
    upper.setCellTexture(7, 5, 1);

    upper.setCellTexture(4, 6, 1);
    upper.setCellTexture(7, 6, 1);

    upper.setCellTexture(4, 7, 1);
    upper.setCellTexture(5, 7, 1);
    upper.setCellTexture(6, 7, 1);
    upper.setCellTexture(7, 7, 1);


    upper.setCellPhys(4, 4, CONSTS.PHYS_TRANSPARENT_BLOCK);
    upper.setCellPhys(5, 4, CONSTS.PHYS_TRANSPARENT_BLOCK);
    upper.setCellPhys(6, 4, CONSTS.PHYS_TRANSPARENT_BLOCK);
    upper.setCellPhys(7, 4, CONSTS.PHYS_TRANSPARENT_BLOCK);
    upper.setCellPhys(4, 5, CONSTS.PHYS_TRANSPARENT_BLOCK);
    upper.setCellPhys(7, 5, CONSTS.PHYS_TRANSPARENT_BLOCK);
    upper.setCellPhys(4, 6, CONSTS.PHYS_TRANSPARENT_BLOCK);
    upper.setCellPhys(7, 6, CONSTS.PHYS_TRANSPARENT_BLOCK);
    upper.setCellPhys(4, 7, CONSTS.PHYS_TRANSPARENT_BLOCK);
    upper.setCellPhys(5, 7, CONSTS.PHYS_TRANSPARENT_BLOCK);
    upper.setCellPhys(6, 7, CONSTS.PHYS_TRANSPARENT_BLOCK);
    upper.setCellPhys(7, 7, CONSTS.PHYS_TRANSPARENT_BLOCK);



    cvs.width = rc._options.screen.width;
    cvs.height = rc._options.screen.height;
    const RENDER_CVS = CanvasHelper.cloneCanvas(cvs);
    const RENDER_CTX = RENDER_CVS.getContext('2d');


    let xCam = 256;
    let yCam = 256;
    let fAngle = 0;
    function doomloop() {
        const scene = rc.computeScene(40, xCam, yCam, fAngle);
        rc.render(scene, RENDER_CTX);
        requestAnimationFrame(() => ctx.drawImage(RENDER_CVS, 0, 0));
    }

    setInterval(doomloop, 40);
    window.RC = rc;
    window.addEventListener('keydown', event => {
        switch (event.key) {
            case 'ArrowUp':
                xCam += 16 * Math.cos(fAngle);
                yCam += 16 * Math.sin(fAngle);
                break;
            case 'ArrowDown':
                xCam -= 16 * Math.cos(fAngle);
                yCam -= 16 * Math.sin(fAngle);
                break;
            case 'ArrowLeft':
                fAngle -= 0.25;
                break;
            case 'ArrowRight':
                fAngle += 0.25;
                break;
        }
    });
}

window.addEventListener('load', main);
