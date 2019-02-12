import Engine from "../../src/engine/Engine";
import KeyboardControlThinker from "../../src/engine/thinkers/KeyboardControlThinker";

const LEVEL = {

    "tilesets": {
        // there is no tilset in this example
        // we only have textures
        "d1": {
            "width": 32,
            "height": 32,
            "src": "textures/d1.png"
        },
        "d2": {
            "width": 32,
            "height": 32,
            "src": "textures/d2.png"
        },
        "d3": {
            "width": 32,
            "height": 32,
            "src": "textures/d3.png"
        },
        "d4": {
            "width": 32,
            "height": 32,
            "src": "textures/d4.png"
        },
        "d5": {
            "width": 32,
            "height": 32,
            "src": "textures/d5.png"
        },
        "d6": {
            "width": 32,
            "height": 32,
            "src": "textures/d6.png"
        },
        "d7": {
            "width": 32,
            "height": 32,
            "src": "textures/d7.png"
        },
        "d8": {
            "width": 32,
            "height": 32,
            "src": "textures/d8.png"
        },
        "d9": {
            "width": 32,
            "height": 32,
            "src": "textures/d9.png"
        },
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
        "map": [ // the map may be defined as an array of strings. each character is a code depicted in the "legend" section
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
        }]
    },
    "camera": {
        "thinker": "KeyboardControlThinker", // the control thinker
        "x": 5, // camera coordinates (x-axis)
        "y": 6, // camera coordinates (y-axis)
        "angle": -Math.PI / 2 - 0.4, // looking angle
        "z": 1 // camera altitude (1 is the default object)
    },
    "objects": [
        // there is no object
    ],
    "decals": [
        {"x": 0, "y": 6, "e": {"align": '@DECAL_ALIGN_TOP_LEFT', "tileset": 'd1'}},
        {"x": 0, "y": 5, "e": {"align": '@DECAL_ALIGN_TOP', "tileset": 'd2'}},
        {"x": 0, "y": 4, "e": {"align": '@DECAL_ALIGN_TOP_RIGHT', "tileset": 'd3'}},
        {"x": 0, "y": 3, "e": {"align": '@DECAL_ALIGN_LEFT', "tileset": 'd4'}},
        {"x": 0, "y": 2, "e": {"align": '@DECAL_ALIGN_CENTER', "tileset": 'd5'}},
        {"x": 0, "y": 1, "e": {"align": '@DECAL_ALIGN_RIGHT', "tileset": 'd6'}},
        {"x": 1, "y": 0, "s": {"align": '@DECAL_ALIGN_BOTTOM_LEFT', "tileset": 'd7'}},
        {"x": 2, "y": 0, "s": {"align": '@DECAL_ALIGN_BOTTOM', "tileset": 'd8'}},
        {"x": 3, "y": 1, "w": {"align": '@DECAL_ALIGN_BOTTOM_RIGHT', "tileset": 'd9'}},
    ]
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

    // starts engine doomloop
    engine.startDoomLoop();
}

window.addEventListener('load', main);
