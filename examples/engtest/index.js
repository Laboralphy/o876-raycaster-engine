import Engine from "../../src/engine/Engine";




function getLevel() {
    const cvs = document.getElementById('screen');
    const LEVEL_TEST = {

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
            }
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
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            ],
            "map2": [
                "############",
                "#          #",
                "#          #",
                "#          #",
                "#          #",
                "#  ##+###  #",
                "#  #    #  #",
                "#  #    #  #",
                "#  ###  #  #",
                "#    ##-#  #",
                "#          #",
                "############",
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
            }
            ]
        }
    };
    return LEVEL_TEST;
}
// json de configuration
async function main() {
    // creates engine
    const engine = new Engine();
    engine.setRenderingCanvas(document.getElementById('screen'));
    await engine.buildLevel(getLevel(), (phase, progress) => {
        console.log(phase, progress);
    });
    //const w = engine.createEntity('m-warlock-b');
    engine.camera.set({
        x: 384,
        y: 128,
        angle: Math.PI / 2,
        z: 1
    });
    engine.startDoomLoop();
    engine.delayCommand(1500, () => engine.openDoor(5, 5, true));
    window.engine = engine;
}

window.addEventListener('load', main);
