import RCE from "../../src";
const Engine = RCE.Engine;
const KeyboardControlThinker = RCE.Thinkers.KeyboardControlThinker;

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
        "textures": {
            "flats": "textures/flats.png",
            "walls": "textures/walls.png"
        },
        "map": [ // the map may be defined as an array of strings. each character is a code depicted in the "legend" section
            "##########",
            "#        #",
            "##+##    #",
            "#   #    #",
            "#   #    #",
            "#   #    #",
            "#   #    #",
            "#   #    #",
            "#   #    #",
            "##########",
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
            "code": '+',
            "phys": "@PHYS_DOOR_UP",
            "faces": {
                "n": 1, // north wall
                "e": 1, // east wall
                "w": 1, // west wall
                "s": 1, // south wall
                "f": 0,
                "c": 1
            }
        }]
    },
    "tags": [
        {
            "x": 1,
            "y": 5,
            "tags": ["open_door 2 2"]
        },
        {
            "x": 2,
            "y": 5,
            "tags": ["open_door 2 2"]
        },
        {
            "x": 3,
            "y": 5,
            "tags": ["open_door 2 2"]
        }
    ],
    "camera": {
        "thinker": "KeyboardControlThinker", // the control thinker
        "x": 2, // camera coordinates (x-axis)
        "y": 6, // camera coordinates (y-axis)
        "angle": -Math.PI / 2 - 0.4, // looking angle
        "z": 1 // camera altitude (1 is the default object)
    },
    "objects": [
        // there is no object
    ],
    "decals": []
};

// note that we use an "async" function, because we deal with promises when textures are loading
async function main() {
    // creates engine
    const engine = new Engine();

    // defines which DOM canvas to use
    engine.setRenderingCanvas(document.getElementById('screen'));

    // declares all thinkers (there is only one here)
    engine.useThinkers({
        KeyboardControlThinker
    });

    // builds level.
    // buildLevel() is an ASYNCHRONOUS function, which return a promise
    // we use the "await" keywork to be sure the level is completly loaded before doing something else.
    await engine.buildLevel(LEVEL);

    // starts engine doomloop
    engine.startDoomLoop();

    // this is what happens when we enter the tag zone "open_door"
    // (we open the door)
    engine.events.on('tag.open_door.enter', ({id, parameters, remove}) => {
        // the tag has two parameters : the coordinates of the door we want to open
        engine.openDoor(parameters[0] | 0, parameters[1] | 0, false);
        remove();
    });
}

window.addEventListener('load', main);
