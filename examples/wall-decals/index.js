/**
 * This example shows how to include decals on walls at different positions.
 */
import RCE from "../../lib/src";
const Engine = RCE.Engine;

const LEVEL = {
    "version": "RCE-100",

    "tilesets": [
        // we have several tileset for this example, but most of tilesets consist only in one frame
        {
            "id": "d1",
            "width": 32,
            "height": 32,
            "src": "textures/d1.png",
            "animations": []
        },
        {
            "id": "d2",
            "width": 32,
            "height": 32,
            "src": "textures/d2.png",
            "animations": []
        },
        {
            "id": "d3",
            "width": 32,
            "height": 32,
            "src": "textures/d3.png",
            "animations": []
        },
        {
            "id": "d4",
            "width": 32,
            "height": 32,
            "src": "textures/d4.png",
            "animations": []
        },
        {
            "id": "d5",
            "width": 32,
            "height": 32,
            "src": "textures/d5.png",
            "animations": []
        },
        {
            "id": "d6",
            "width": 32,
            "height": 32,
            "src": "textures/d6.png",
            "animations": []
        },
        {
            "id": "d7",
            "width": 32,
            "height": 32,
            "src": "textures/d7.png",
            "animations": []
        },
        {
            "id": "d8",
            "width": 32,
            "height": 32,
            "src": "textures/d8.png",
            "animations": []
        },
        {
            "id": "d9",
            "width": 32,
            "height": 32,
            "src": "textures/d9.png",
            "animations": []
        },
    ],

    "blueprints": [
        // there are no blueprint in this example, we don't have any sprites
    ],

    "level": {
        "metrics": {
            "spacing": 64,  // each map cell is 64 texel-wide
            "height": 96    // ceilling height is 96 texels height
        },
        "textures": {
            "flats": "textures/flats.png", // floor and ceiling textures
            "walls": "textures/walls.png",  // wall textures
            "sky": "",
            "smooth": false,
            "stretch": false
        },
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
            "phys": "@PHYS_WALL", // you cannot walk on this character : it's a wall,
            "faces": {
                "n": 0, // north wall texture (taken from "walls" property)
                "e": 0, // east wall texture  (taken from "walls" property)
                "w": 0, // west wall texture  (....)
                "s": 0, // south wall texture
            }
        }]
    },
    "camera": {
        "thinker": "FPSControlThinker", // the control thinker
        "x": 5, // camera coordinates (x-axis)
        "y": 6, // camera coordinates (y-axis)
        "angle": -Math.PI / 2 - 0.4, // looking angle
        "z": 1 // camera altitude (1 is the default object)
    },
    "objects": [
        // there is no object
    ],
    "decals": [
        // x and y are the block coordinates, the "e" property means the "east side of the wall"
        // the "s" is for the south side
        // the "w" is for the west side
        // the "n" is for the north side
        {"x": 0, "y": 6, "e": {"align": '@DECAL_ALIGN_TOP_LEFT', "tileset": 'd1'}},
        {"x": 0, "y": 6, "e": {"align": '@DECAL_ALIGN_TOP', "tileset": 'd2'}},
        {"x": 0, "y": 4, "e": {"align": '@DECAL_ALIGN_TOP_RIGHT', "tileset": 'd3'}},
        {"x": 0, "y": 3, "e": {"align": '@DECAL_ALIGN_LEFT', "tileset": 'd4'}},
        {"x": 0, "y": 2, "e": {"align": '@DECAL_ALIGN_CENTER', "tileset": 'd5'}},
        {"x": 0, "y": 1, "e": {"align": '@DECAL_ALIGN_RIGHT', "tileset": 'd6'}},
        {"x": 1, "y": 0, "s": {"align": '@DECAL_ALIGN_BOTTOM_LEFT', "tileset": 'd7'}},
        {"x": 2, "y": 0, "s": {"align": '@DECAL_ALIGN_BOTTOM', "tileset": 'd8'}},
        {"x": 3, "y": 1, "w": {"align": '@DECAL_ALIGN_BOTTOM_RIGHT', "tileset": 'd9'}},
    ],
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

    // starts engine doomloop
    engine.startDoomLoop();
}

window.addEventListener('load', main);
