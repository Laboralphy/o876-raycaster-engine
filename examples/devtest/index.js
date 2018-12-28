// main

import rclib from '../../src';

const {CanvasHelper, Renderer, CONSTS} = rclib;



async function main() {
    CanvasHelper.setDefaultImageSmoothing(false);
    let cvs = document.querySelector('canvas');
    let ctx = cvs.getContext('2d');
    CanvasHelper.setImageSmoothing(cvs, false);

    // loading all textures from png files
    let cWall = await CanvasHelper.loadCanvas('textures/walls.png');
    let cFlat = await CanvasHelper.loadCanvas('textures/flats.png');
    let cBG = await CanvasHelper.loadCanvas('textures/sky.png');

    // creating the renderer
    let rc = new Renderer();

    // defining options
    rc.defineOptions({
        metrics: {
            spacing: 64,    // aligned with texture width and height
            height: 96
        },
        screen: {
            width: cvs.width,       // aligned with the physical DOM canvas
            height: cvs.height
        }
    });

    // creating second storey
    const storey = rc.createStorey();   // there is a second floor

    // declaring textures
    rc.setWallTextures(cWall);
    rc.setFlatTextures(cFlat);
    rc.setBackground(cBG);

    // map is 30 cells wide
    rc.setMapSize(30);

    // registering materials
    rc.registerCellMaterial(0, {n: null, e: null, s: null, w: null, f: 0, c: 2});       // walkable cell
    rc.registerCellMaterial(1, {n: 0, e: 0, s: 0, w: 0, f: null, c: null});             // wall
    rc.registerCellMaterial(2, {n: 1, e: 1, s: 1, w: 1, f: 0, c: 2});                   // door
    rc.registerCellMaterial(3, {n: 4, e: 4, s: 4, w: 4, f: 0, c: 2});                   // widow
    rc.registerCellMaterial(4, {n: 0, e: 1, s: 2, w: 3, f: 0, c: 2});                   // never used

    // creating an animated wall
    let oAnim = rc.createAnimation(5, 5, 160, CONSTS.ANIM_LOOP_FORWARD);
    // applying animated to a cell material
    rc.registerCellMaterial(5, {n: oAnim, e: oAnim, s: oAnim, w: oAnim, f: null, c: null});
    // .. instead of fixed indices, we provide the animation object

    // two more materials for the second storey
    rc.registerCellMaterial(6, {n: null, e: null, s: null, w: null, f: 0, c: null});
    rc.registerCellMaterial(7, {n: null, e: null, s: null, w: null, f: 3, c: 2});

    //
    for (let y = 0; y < 20; ++y) {
        for (let x = 0; x < 10; ++x) {
            rc.setCellMaterial(x, y, 1);
            rc.setCellPhys(x, y, 1);
            rc.setCellMaterial(x + 9, y, 1);
            rc.setCellPhys(x + 9, y, 1);

            storey.setCellMaterial(x, y, 1);
            storey.setCellPhys(x, y, 1);
            storey.setCellMaterial(x + 9, y, 1);
            storey.setCellPhys(x + 9, y, 1);
        }
    }
    for (let y = 1; y < 19; ++y) {
        for (let x = 1; x < 9; ++x) {
            rc.setCellMaterial(x, y, 0);
            rc.setCellPhys(x, y, 0);
            rc.setCellMaterial(x + 9, y, 0);
            rc.setCellPhys(x + 9, y, 0);

            storey.setCellMaterial(x, y, 0);
            storey.setCellPhys(x, y, 0);
            storey.setCellMaterial(x + 9, y, 0);
            storey.setCellPhys(x + 9, y, 0);
        }
    }
    rc.setCellMaterial(9, 3, 2);
    rc.setCellPhys(9, 3, CONSTS.PHYS_DOOR_SLIDING_DOUBLE);
    rc.setCellOffset(9, 3, 10);

    rc.setCellMaterial(9, 5, 3);
    rc.setCellPhys(9, 5, CONSTS.PHYS_TRANSPARENT_BLOCK);
    rc.setCellOffset(9, 5, 32);

    rc.setCellMaterial(4, 0, 3);
    rc.setCellPhys(4, 0, CONSTS.PHYS_TRANSPARENT_BLOCK);
    rc.setCellOffset(4, 0, 32);

    rc.setCellMaterial(2, 2, 5);
    rc.setCellPhys(2, 2, CONSTS.PHYS_TRANSPARENT_BLOCK);

    rc.setCellMaterial(5, 5, 6);
    rc.setCellMaterial(6, 5, 6);

    rc.setCellMaterial(5, 6, 6);
    rc.setCellMaterial(6, 6, 6);

    rc.setCellMaterial(4, 2, 7);


    storey.setCellMaterial(4, 4, 1);
    storey.setCellMaterial(5, 4, 1);
    storey.setCellMaterial(6, 4, 1);
    storey.setCellMaterial(7, 4, 1);

    storey.setCellMaterial(4, 5, 1);
    storey.setCellMaterial(7, 5, 1);

    storey.setCellMaterial(4, 6, 1);
    storey.setCellMaterial(7, 6, 1);

    storey.setCellMaterial(4, 7, 1);
    storey.setCellMaterial(5, 7, 1);
    storey.setCellMaterial(6, 7, 1);
    storey.setCellMaterial(7, 7, 1);


    storey.setCellPhys(4, 4, CONSTS.PHYS_TRANSPARENT_BLOCK);
    storey.setCellPhys(5, 4, CONSTS.PHYS_TRANSPARENT_BLOCK);
    storey.setCellPhys(6, 4, CONSTS.PHYS_TRANSPARENT_BLOCK);
    storey.setCellPhys(7, 4, CONSTS.PHYS_TRANSPARENT_BLOCK);
    storey.setCellPhys(4, 5, CONSTS.PHYS_TRANSPARENT_BLOCK);
    storey.setCellPhys(7, 5, CONSTS.PHYS_TRANSPARENT_BLOCK);
    storey.setCellPhys(4, 6, CONSTS.PHYS_TRANSPARENT_BLOCK);
    storey.setCellPhys(7, 6, CONSTS.PHYS_TRANSPARENT_BLOCK);
    storey.setCellPhys(4, 7, CONSTS.PHYS_TRANSPARENT_BLOCK);
    storey.setCellPhys(5, 7, CONSTS.PHYS_TRANSPARENT_BLOCK);
    storey.setCellPhys(6, 7, CONSTS.PHYS_TRANSPARENT_BLOCK);
    storey.setCellPhys(7, 7, CONSTS.PHYS_TRANSPARENT_BLOCK);


    const cExplo = await CanvasHelper.loadCanvas('textures/o_expfire.png');
    const tsExplo = rc.buildTileSet(cExplo, 64, 96);
    const rcos = rc.options.shading;
    rc.shadeTileSet(tsExplo, rcos.shades, rcos.color, rcos.filter, rcos.brightness);
    const spr1 = rc.buildSprite(tsExplo);
    spr1.buildAnimation(0, 9, 100, CONSTS.ANIM_LOOP_FORWARD);
    spr1.x = 64 * 4 + 32;
    spr1.y = 64 * 2 + 32;
    //spr1.addFlag(CONSTS.FX_LIGHT_SOURCE);
    //spr1.addFlag(CONSTS.FX_LIGHT_ADD);




    let xCam = 64 * 4 + 32;
    let yCam = 64 * 7 + 32;
    let fAngle = -Math.PI / 2;
    let fHeight = 1;

    let xMouse = 0;
    let yMouse = 0;

    cvs.addEventListener('mousemove', function(event) {
        xMouse = event.pageX - cvs.offsetLeft;
        yMouse = event.pageY - cvs.offsetTop;
    });


    let TIME = 0;

    function doomloop() {
        TIME += 40;
        spr1.h = Math.abs(25 * Math.sin(TIME / 400));
        rc.computeAnimations(40);
        const scene = rc.computeScene(xCam, yCam, fAngle, fHeight);
        rc.render(scene);
        requestAnimationFrame(() => rc.flip(ctx));
    }


    setInterval(doomloop, 40);
    window.RC = rc;
    window.addEventListener('keydown', event => {
        switch (event.key) {
            case 'ArrowUp':
                xCam += (event.shiftKey ? 2 : 16) * Math.cos(fAngle);
                yCam += (event.shiftKey ? 2 : 16) * Math.sin(fAngle);
                break;
            case 'ArrowDown':
                xCam -= (event.shiftKey ? 2 : 16) * Math.cos(fAngle);
                yCam -= (event.shiftKey ? 2 : 16) * Math.sin(fAngle);
                break;
            case 'ArrowLeft':
                fAngle -= (event.shiftKey ? 0.025 : 0.25);
                break;
            case 'ArrowRight':
                fAngle += (event.shiftKey ? 0.025 : 0.25);
                break;
            case '+':
                rc._options.screen.focal *= 1.1;
                break;
            case '-':
                rc._options.screen.focal /= 1.1;
                break;
            case 'PageUp':
                fHeight += 0.1;
                break;
            case 'PageDown':
                fHeight -= 0.1;
                break;

        }
    });
}

window.addEventListener('load', main);
