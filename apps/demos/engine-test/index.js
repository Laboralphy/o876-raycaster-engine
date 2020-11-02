import Engine from "libs/engine/Engine";
import DevKbdThinker from "./DevKbdThinker";
import DevKbdMobThinker from "./DevKbdMobThinker";
import MagboltThinker from "./MagboltThinker";


/**
 * This is a more complex example written during development phase
 */


const THINKERS = {
    DevKbdMobThinker,
    DevKbdThinker,
    MagboltThinker
};

function getLevel() {
    return {
        "version": "RCE-100",
        "tilesets": [
            {
                "id": "m-warlock-b",
                "src": "gfx/sprites/m_warlock_b.png",
                "width": 64,
                "height": 96,
                "animations": [
                    {
                        "id": "stand",
                        "start": [8, 10, 12, 14, 0, 2, 4, 6],
                        "length": 1,
                        "loop": "@LOOP_NONE"
                    },
                    {
                        "id": "walk",
                        "start": [8, 10, 12, 14, 0, 2, 4, 6],
                        "length": 2,
                        "loop": "@LOOP_FORWARD",
                        "duration": 133
                    },
                    {
                        "id": "attack",
                        "start": [8, 10, 12, 14, 0, 2, 4, 6],
                        "length": 2,
                        "loop": "@LOOP_FORWARD",
                        "duration": 40
                    },
                    {
                        "id": "death",
                        "start": 16,
                        "length": 11,
                        "loop": "@LOOP_NONE",
                        "duration": 80,
                        "iterations": 1
                    }
                ]
            },
            {
                "id": "p-magbolt-0",
                "src": "gfx/sprites/p_magbolt.png",
                "width": 48,
                "height": 64,
                "animations": [
                    {
                        "id": "fly",
                        "start": [4, 5, 6, 7, 0, 1, 2, 3],
                        "length": 1,
                        "loop": "@LOOP_NONE"
                    },
                    {
                        "id": "explode",
                        "start": 8,
                        "length": 6,
                        "loop": "@LOOP_FORWARD",
                        "duration": 80,
                        "iterations": 1
                    }
                ]
            },
            {
                "id": "o-twisted",
                "src": "gfx/sprites/w_twisted_novellist.png",
                "width": 145,
                "height": 192,
                "animations": []
            },
            {
                "id": "o-bluedisc",
                "src": "gfx/sprites/o_bluedisc.png",
                "width": 32,
                "height": 32,
                "animations": [
                    {
                        "id": "normal",
                        "start": 0,
                        "length": 5,
                        "loop": "@LOOP_YOYO"
                    }
                ]
            },
            {
                "id": "o-bluereddisc",
                "src": "gfx/sprites/o_bluereddisc.png",
                "width": 32,
                "height": 32,
                "animations": [
                    {
                        "id": "blue",
                        "start": 0,
                        "length": 5,
                        "loop": "@LOOP_YOYO",
                        "duration": 160
                    },
                    {
                        "id": "red",
                        "start": 5,
                        "length": 5,
                        "loop": "@LOOP_YOYO",
                        "duration": 40
                    }
                ]
            }
        ],

        "blueprints": [
            {
                "id": "m-warlock-b",
                "tileset": "m-warlock-b",
                "thinker": 'DevKbdMobThinker',
                "size": 24
            },

            {
                "id": "p-magbolt-0",
                "tileset": "p-magbolt-0",
                "thinker": 'MagboltThinker',
                "size": 16,
                "fx": ["@FX_LIGHT_SOURCE"]
            },

            {
                "id": "o-bluedisc",
                "tileset": "o-bluedisc",
                "size": 24
            },

            {
                "id": "o-twisted",
                "tileset": "o-twisted",
                "scale": 2,
                "size": 24,
                "fx": ["@FX_LIGHT_ADD", "@FX_LIGHT_SOURCE"]
            },

            {
                "id": "o-bluereddisc",
                "tileset": "o-bluereddisc",
                "thinker": 'StaticTangibleThinker',
                "size": 16
            },
        ],

        "level": {
            "metrics": {
                "spacing": 64,
                "height": 96
            },
            "textures": {
                "flats": "gfx/textures/flats-1.png",
                "walls": "gfx/textures/walls-2.png",
                "sky": "gfx/textures/sky.png",
                smooth: false,
                stretch: false
            },
            "map": [
                "####################",
                "##   #            ##",
                ".+   #            ##",
                "##   #            ##",
                "##   ###############",
                "##   #            ##",
                "##   #            ##",
                ".+   -            ##",
                "##   #            ##",
                "##   #            ##",
                "##   ###############",
                "##                ##",
                ".+   #            ##",
                "##                ##",
                "##                ##",
                "##                ##",
                "##                ##",
                ".+                ##",
                "##                ##",
                "####################"
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
            }, {
                "code": '-',
                "phys": "@PHYS_DOOR_DOUBLE",
                "faces": {
                    "n": 32,
                    "e": 32,
                    "w": 32,
                    "s": 32,
                    "f": 0,
                    "c": 1
                }
            }, {
                "code": '+',
                "phys": "@PHYS_TRANSPARENT_BLOCK",
                "faces": {
                    "n": 5,
                    "e": 5,
                    "w": 5,
                    "s": 5,
                    "f": 0,
                    "c": 1
                },
                "offset": 32
            }, {
                "code": '.',
                "phys": "@PHYS_NONE",
                "faces": {
                    "f": 0,
                    "c": 1
                }
            }
            ]
        },
        "objects": [
            {
                "x": 9 * 64 + 32,
                "y": 13 * 64 + 32,
                "z": 0,
                "angle": 0,
                "blueprint": "o-bluereddisc",
                "animation": "red"
            },
            {
                "x": 7 * 64 + 32,
                "y": 13 * 64 + 32,
                "z": 0,
                "angle": 0,
                "blueprint": "o-twisted",
                "animation": null
            },
            {
                "x": 14 * 64 + 32,
                "y": 13 * 64 + 32,
                "z": 0,
                "angle": 0,
                "blueprint": "m-warlock-b",
                "animation": "stand"
            }
        ],
        "decals": [],
        "camera": {
            "thinker": "DevKbdThinker", // the control thinker
            x: 9, // visor coordinates (x-axis)
            y: 18, // visor coordinates (y-axis)
            angle: -1 * Math.PI / 2, // looking angle
            z: 1 // visor altitude (1 is the default object)
        },
        "tags": [],
        "lightsources": [
            {
                "x": 32,
                "y": 64 * 2,
                "r0": 64,
                "r1": 512,
                "v": 0.5
            },
            {
                "x": 32,
                "y": 64 * 7,
                "r0": 64,
                "r1": 512,
                "v": 0.5
            },
            {
                "x": 32,
                "y": 64 * 12,
                "r0": 64,
                "r1": 512,
                "v": 0.5
            },
            {
                "x": 32,
                "y": 64 * 17,
                "r0": 64,
                "r1": 512,
                "v": 0.5
            }
        ]
    };
}
// json de configuration
async function main() {
    // creates engine
    const engine = new Engine();
    // declare thinkers
    engine.useThinkers(THINKERS);
    // defines which physical canvas to use
    engine.setRenderingCanvas(document.getElementById('screen'));
    // builds level, display progress on console
    await engine.buildLevel(getLevel(), (phase, progress) => {
        console.log(phase, progress);
    });
    // retrieves the visor thinker. it's a DevKbdThinker
    // which is a thinker of keyboard control, for controlling the visor
    // we want to customize keyboard event
    const ct = engine.camera.thinker;

    // retrieve the warlock which is the second entity created
    const oWarlock = engine.horde.entities[3];

	// plugs keyboard events
    window.addEventListener('keydown', event => {
        ct.keyDown(event.key);
        oWarlock.thinker.keyDown(event.key);
    });
    window.addEventListener('keyup', event => {
        ct.keyUp(event.key);
        oWarlock.thinker.keyUp(event.key);
    });


    // starts engine doomloop
    engine.startDoomLoop();

    // collision avec mur
    // déterminer le secteur de l'angle de déplacement
    // déterminer la liste des yeux de collision
    // effectuer les tests de collision sur les yeux
    window.engine = engine;
}

window.addEventListener('load', main);
