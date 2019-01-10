import Engine from "../../src/engine/Engine";
import DevKbd from "./DevKbd";

function getLevel() {
    return {

        "tilesets": {
            "m-warlock-b": {
                "src": "gfx/sprites/m_warlock_b.png",
                "width": 64,
                "height": 96,
                "animations": {
                    "stand": {
                        "start": [0, 2, 4, 6, 8, 10, 12, 14],
                        "length": 1,
                        "loop": "@LOOP_NONE"
                    },
                    "walk": {
                        "start": [0, 2, 4, 6, 8, 10, 12, 14],
                        "length": 2,
                        "loop": "@LOOP_FORWARD",
                        "duration": 400
                    },
                    "attack": {
                        "start": [0, 2, 4, 6, 8, 10, 12, 14],
                        "length": 2,
                        "loop": "@LOOP_FORWARD",
                        "duration": 40
                    },
                    "death": {
                        "start": 16,
                        "length": 11,
                        "loop": "@LOOP_FORWARD",
                        "duration": 80,
                        "iterations": 1
                    }
                }
            },
            "p-magbolt-0": {
                "src": "gfx/sprites/p_magbolt.png",
                "width": 64,
                "height": 64,
                "fx": "@FX_LIGHT_SOURCE",
                "animations": {
                    "fly": {
                        "start": [0, 1, 2, 3, 4, 5, 6, 7],
                        "length": 1,
                        "loop": "@LOOP_NONE"
                    },
                    "explode": {
                        "start": 8,
                        "length": 6,
                        "loop": "@LOOP_FORWARD",
                        "duration": 80,
                        "iterations": 1
                    }
                }
            },
            "o-bluedisc": {
                "src": "gfx/sprites/o_bluedisc.png",
                "width": 32,
                "height": 32,
                "fx": "@FX_LIGHT_SOURCE",
                "animations": {
                    "normal": {
                        "start": 0,
                        "length": 5,
                        "loop": "@LOOP_YOYO"
                    }
                }
            },
            "o-bluereddisc": {
                "src": "gfx/sprites/o_bluereddisc.png",
                "width": 32,
                "height": 32,
                "fx": "@FX_NONE",
                "animations": {
                    "blue": {
                        "start": 0,
                        "length": 5,
                        "loop": "@LOOP_YOYO",
                        "duration": 160
                    },
                    "red": {
                        "start": 5,
                        "length": 5,
                        "loop": "@LOOP_YOYO",
                        "duration": 40
                    }
                }
            }
        },

        "blueprints": {
            "m-warlock-b": {
                "tileset": "m-warlock-b",
                "thinker": null
            },

            "p-magbolt-0": {
                "tileset": "p-magbolt-0",
                "thinker": null
            },

            "o-bluedisc": {
                "tileset": "o-bluedisc",
                "thinker": null
            },

            "o-bluereddisc": {
                "tileset": "o-bluereddisc",
                "thinker": null
            },



        },

        "level": {
            "metrics": {
                "spacing": 64,
                "height": 96
            },
            "flats": "gfx/textures/flats-1.png",
            "walls": "gfx/textures/walls-2.png",
            "sky": "gfx/textures/sky.png",
            "map": [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0,10,10, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0,10,10, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ],
            "map-upper": [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0,11,11,11,11, 0, 1],
                [1, 0, 0, 0, 0, 0,11, 0, 0,11, 0, 1],
                [1, 0, 0, 0, 0, 0,11, 0, 0,11, 0, 1],
                [1, 0, 0, 0, 0, 0,11,11,11,11, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ],
            "legend": [{
                "code": 0,
                "phys": "@PHYS_NONE",
                "faces": {
                    "f": 0,
                    "c": 1
                }
            }, {
                "code": 1,
                "phys": "@PHYS_WALL",
                "faces": {
                    "n": 0,
                    "e": 0,
                    "w": 0,
                    "s": 0,
                }
            }, {
                "code": 2,
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
                "code": 3,
                "phys": "@PHYS_TRANSPARENT_BLOCK",
                "faces": {
                    "n": 5,
                    "e": 5,
                    "w": 5,
                    "s": 5,
                    "f": 0,
                    "c": 1
                }
            }, {
                "code": 10,
                "phys": "@PHYS_NONE",
                "faces": {
                    "f": 0
                }
            }, {
                "code": 11,
                "phys": "@PHYS_TRANSPARENT_BLOCK",
                "faces": {
                    "n": 0,
                    "e": 0,
                    "w": 0,
                    "s": 0,
                }
            }
            ]
        },
        "objects": [
            {
                "x": 128,
                "y": 256,
                "angle": 0,
                "blueprint": "o-bluereddisc"
            }
        ]
    };
}
// json de configuration
async function main() {
    // creates engine
    const engine = new Engine();
    // defines which physical canvas to use
    engine.setRenderingCanvas(document.getElementById('screen'));
    // builds level, display progress on console
    await engine.buildLevel(getLevel(), (phase, progress) => {
        console.log(phase, progress);
    });
    //const w = engine.createEntity('m-warlock-b');
    
    // creates a thinker
    const ct = new DevKbd();

	// plug keyboards events
    window.addEventListener('keydown', event => ct.keyDown(event.key));
    window.addEventListener('keyup', event => ct.keyUp(event.key));
    
    // links this thinker to the camera
    engine.camera.thinker = ct;
    // sets initial location
    engine.camera.location.set({
        x: 384,
        y: 128,
        angle: Math.PI / 2,
        z: 1
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
