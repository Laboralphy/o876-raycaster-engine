import Engine from "../../src/engine/Engine";

/**
 * This program is one of the simplest example we can give to build a level
 */

const LEVEL = {

    "tilesets": {
        // there is no tilset in this example
        // we only have textures
    },

    "blueprints": {
        // there are no blueprint in this example, we don't have any sprites
    },

    "level": {
        "metrics": {
            "spacing": 64,  // each map cell is 64 texel-wide
            "height": 96    // ceilling height is 96 texels height
        },
        "flats": "textures/flats.png",
        "walls": "textures/walls.png",
        "map": [
            "########",
            "#  ##  #",
            "#      #",
            "#      #",
            "#      #",
            "#      #",
            "#      #",
            "########",
        ],
        "legend": [{
            "code": ' ',
            "phys": "@PHYS_NONE",
            "faces": {
                "f": 0,
                "c": 1
            }
        }, {
            "code": '#',
            "phys": "@PHYS_WALL",
            "faces": {
                "n": 0,
                "e": 0,
                "w": 0,
                "s": 0,
            }
        }]
    },
    "objects": [
        // there is no object
    ]
};

// note that we use an "async" function, because we deal with promises when texture are loading
async function main() {

    // creates engine
    const engine = new Engine();

    // defines which DOM canvas to use
    engine.setRenderingCanvas(document.getElementById('screen'));

    // builds level.
    // there is asynchronous image loading, so the buildLevel() function returns a promise,
    // we should use the "await" keywork, because we are in a "async" function.
    await engine.buildLevel(LEVEL);

    // sets initial camera location, and orientation
    engine.camera.location.set({
        x: 5 * 64, // camera coordinates (x-axis)
        y: 6 * 64, // camera coordinates (y-axis)
        angle: -Math.PI / 2 - 0.4, // looking angle
        z: 1 // camera altitude (1 is the default object)
    });

    // starts engine doomloop
    engine.startDoomLoop();
}

window.addEventListener('load', main);
