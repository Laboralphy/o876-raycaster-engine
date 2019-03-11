import Engine from "../../src/engine/Engine";
import KeyboardControlThinker from "../../src/engine/thinkers/KeyboardControlThinker";

/**
 * This program is one of the simplest example we can give to build a level, and control a camera view inside
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
        "sky": "textures/sky-ls.png",
        "map": [ // the map may be defined as an array of strings. each character is a code depicted in the "legend" section
            "######################",
            "#         ############",
            "#         ############",
            "w         ############",
            "#          *+#########",
            "#         ############",
            "#         ############",
            "#         ############",
            "#  #      ############",
            "w  #       *+#########",
            "#  #      ############",
            "#         ############",
            "#         ############",
            "#         ############",
            "#                    #",
            "w                    #",
            "#           #   #    #",
            "#                    #",
            "#         #  *    #  #",
            "#                    #",
            "#                    #",
            "######################",
        ],
        "legend": [{
            "code": ' ',
            "phys": "@PHYS_NONE", // you can walk on this "character"
            "faces": {
                "f": 0, // floor texture (taken from "flats" property)
                "c": 1  // ceiling texture (taken from "flats" property)
            }
        }, {
            "code": '#',
            "phys": "@PHYS_WALL", // you cannot walk on this character,
            "faces": {
                "n": 0, // north wall
                "e": 0, // east wall
                "w": 0, // west wall
                "s": 0, // south wall
            }
        }, {
            "code": 'w',
            "phys": "@PHYS_INVISIBLE_BLOCK", // you cannot walk on this character,
            "faces": {
                "f": 0, // floor texture (taken from "flats" property)
                "c": 1  // ceiling texture (taken from "flats" property)
            },
            "light": {
                "r0": 128,
                "r1": 256,
                "v": 0.3
            }
        }, {
            "code": '+',
            "phys": "@PHYS_WALL", // you cannot walk on this character,
            "faces": {
                "n": 1, // north wall
                "e": 1, // east wall
                "w": 1, // west wall
                "s": 1, // south wall
            }
        }, {
            "code": '*',
            "phys": "@PHYS_NONE", // you cannot walk on this character,
            "faces": {
                "f": 0, // floor texture (taken from "flats" property)
                "c": 2  // ceiling texture (taken from "flats" property)
            },
            "light": {
                "r0": 256,
                "r1": 384,
                "v": 0.45
            }
        }]
    },
    "camera": {
        "thinker": "KeyboardControlThinker", // the control thinker
        x: 2, // camera coordinates (x-axis)
        y: 1, // camera coordinates (y-axis)
        angle: Math.PI / 2, // looking angle
        z: 1 // camera altitude (1 is the default object)
    },
    "objects": [
        // there is no object
    ],
    "decals": []
};

// note that we use an "async" function, because we deal with promises when texture are loading
async function main() {
    // creates engine
    const engine = new Engine();

    // defines which DOM canvas to use
    engine.setRenderingCanvas(document.getElementById('screen'));

    // declares all thinkers (tere is only one here)
    engine.declareThinkers({
        KeyboardControlThinker
    });

    // builds level.
    // there is asynchronous image loading, so the buildLevel() function returns a promise,
    // we should use the "await" keywork, because we are in a "async" function.
    await engine.buildLevel(LEVEL);

    // set VR mode on
    engine.raycaster.options.screen.vr = true;

    // starts engine doomloop
    engine.startDoomLoop();
}

window.addEventListener('load', main);