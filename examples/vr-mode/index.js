import RCE from "../../src/libs";
const Engine = RCE.Engine;

/**
 * This program enables the VR mode which splits the screen in two halves, vertically, each half being slightly
 * different to gives an illusion of 3D when using VR goggles.
 */

const LEVEL = {
    "version": "RCE-100",

    "tilesets": [],
    // there is no tilset in this example
    // we only have textures


    "blueprints": [],
    // there are no blueprint in this example, we don't have any sprites

    "level": {
        "metrics": {
            "spacing": 64,  // each map cell is 64 texel-wide
            "height": 96    // ceilling height is 96 texels height
        },
        "textures": {
            "flats": "textures/flats.png",
            "sky": "textures/sky-ls.png",
            "walls": "textures/walls.png",
            "smooth": false,
            "stretch": false
        },
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
            }
        }]
    },
    "camera": {
        "thinker": "FPSControlThinker", // the control thinker
        x: 2, // camera coordinates (x-axis)
        y: 1, // camera coordinates (y-axis)
        angle: Math.PI / 2, // looking angle
        z: 1 // camera altitude (1 is the default object)
    },
    "objects": [
        // there is no object
    ],
    "decals": [],
    "tags": [],
    "lightsources": []
};

// note that we use an "async" function, because we deal with promises when textures are loading
async function main() {
    // creates engine
    const engine = new Engine();

    // defines which DOM canvas to use
    engine.setRenderingCanvas(document.getElementById('screen'));

    // builds level.
    // buildLevel() is an ASYNCHRONOUS function, which return a promise
    // we use the "await" keywork to be sure the level is completly loaded before doing something else.
    await engine.buildLevel(LEVEL);

    // bindings keyboard events
    window.addEventListener('keydown', event => engine.camera.thinker.keyDown(event.key));
    window.addEventListener('keyup', event => engine.camera.thinker.keyUp(event.key));

    // set VR mode on
    engine.raycaster.options.screen.vr = true;

    // starts engine doomloop
    engine.startDoomLoop();
}

window.addEventListener('load', main);
