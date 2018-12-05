// everybody should use ecmascript 6 syntax in 2018



/**
 * This is the doomloop, every game has a doomloop.
 * This is a function that is continuously called at a very short interval.
 * this function is repeated every 40 milliseconds, that is 25 frames per secondes.
 */
function doomloop(rend, camera, context) {
    // recompture all texture/sprite animation with a time-delta of 40ms
    rend.computeAnimations(40);
    // create a new scene for these parameters
    const scene = rend.computeScene(camera.x, camera.y, camera.angle, camera.height);
    // render the scene, the scene will be rendered on the internal canvas of the raycaster renderer
    rend.render(scene);
    // display the raycaster internal canvas on the physical DOM canvas
    // requestAnimationFrame is called here to v-synchronize and have a neat animation
    requestAnimationFrame(() => rend.flip(context));
}

/**
 * This function will accept a key code and a shift key state, and will perform some operation on the camera object
 * This allow the player to move the camera point of view
 * @param key {string} key description
 * @param shift {boolean} true if shift is currently pressed
 * @param camera {object} a camera object
 */
function dealWithKey(key, shift, camera) {
    switch (key) {
        case 'ArrowUp':
            camera.x += (shift ? 2 : 16) * Math.cos(camera.angle);
            camera.y += (shift ? 2 : 16) * Math.sin(camera.angle);
            break;
        case 'ArrowDown':
            camera.x -= (shift ? 2 : 16) * Math.cos(camera.angle);
            camera.y -= (shift ? 2 : 16) * Math.sin(camera.angle);
            break;
        case 'ArrowLeft':
            camera.angle -= (shift ? 0.025 : 0.25);
            if (camera.angle <= (-2 * Math.PI)) {
                camera.angle += 2 * Math.PI;
            }
            break;
        case 'ArrowRight':
            camera.angle += (shift ? 0.025 : 0.25);
            if (camera.angle >= (2 * Math.PI)) {
                camera.angle -= 2 * Math.PI;
            }
            break;
    }
}





async function main() {

    // a shorter namespace
    const RC = Raycaster;
    const CONSTS = RC.CONSTS;

    // 1) get the existing canvas
    const canvas = document.querySelector('#canvas');


    // 2) instanciate raycaster renderer
    const rend = new RC.Renderer();
    const camera = {
        x: 64 * 3 + 32,
        y: 64 * 3 + 32,
        angle: 0,
        height: 1
    };

    // 3) define potions
    // these are basic options
    rend.defineOptions({
        metrics: {
            spacing: 64,    // each cell is 64 texels (square shaped)
            height: 96      // walls are 96 texels height
        },
        screen: {
            width: canvas.width,       // the rendering canvas should always be the same size as the physical DOM canvas
            height: canvas.height
        }
    });

    // 3) load all textures
    // beware : ecmasprit 6 syntax (await) !!!

    // load wall textures 128x64 pixel per tile
    const walls = await RC.CanvasHelper.loadCanvas('textures/walls.png');

    // load flat (floor and ceiling) textures 64x64 pixels per tile
    const flats = await RC.CanvasHelper.loadCanvas('textures/flats.png');

    // load the background images
    const sky = await RC.CanvasHelper.loadCanvas('textures/sky.png');


    // 4) declare the textures to the renderer
    rend.setWallTextures(walls);
    rend.setFlatTextures(flats);
    rend.setBackground(sky);


    // 5) create a map with MapHelper
    const data = {
        map: [
            '#######', // this is a simple room
            '#     #',
            '#     #',
            '#     #',
            '#     #',
            '#     #',
            '#######'
        ],
        legend: [{
            code: ' ',
            phys: CONSTS.PHYS_NONE,
            faces: {
                f: 0,
                c: 1
            }
        }, {
            code: '#',
            phys: CONSTS.PHYS_WALL,
            faces: {
                n: 0,
                s: 0,
                w: 0,
                e: 0
            }
        }]
    };

    const mh = new RC.MapHelper();
    mh.build(rend, data);

    // get the rendering context
    const context = canvas.getContext('2d');

    // declare events to animate the game.
    window.setInterval(() => doomloop(rend, camera, context), 40);

    // declare event to move camera with keyboard
    window.addEventListener('keydown', event => dealWithKey(event.key, event.shiftKey, camera));

}

window.addEventListener('load', main);