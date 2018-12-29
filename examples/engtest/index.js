import Engine from "../../src/engine";

// json de configuration
const WAD = {

    "tiles": {
        "flats1": {
            "src": "gfx/textures/flats-1.png",
            "width": 64,
            "height": 64
        },
        "walls2": {
            "src": "gfx/textures/walls-2.png",
            "width": 64,
            "height": 96
        }
    },


    "levels": {
        "test": {
            "blueprints": [
                "m-warlock-b",
                "p-magbolt-0"
            ]
        }
    },

    "blueprints": {
        "m-warlock-b": {
            "src": "gfx/sprites/m_warlock_b.png",
            "width": 64,
            "height": 96,
            "thinker": null,
            "animations": {

                // STAND
                "stand-f": {
                    "start": 0,
                    "loop": 0,
                },
                "stand-fl": {
                    "start": 2,
                    "loop": 0,
                },
                "stand-l": {
                    "start": 4,
                    "loop": 0,
                },
                "stand-bl": {
                    "start": 6,
                    "loop": 0,
                },
                "stand-b": {
                    "start": 8,
                    "loop": 0,
                },
                "stand-br": {
                    "start": 10,
                    "loop": 0,
                },
                "stand-r": {
                    "start": 12,
                    "loop": 0,
                },
                "stand-fr": {
                    "start": 14,
                    "loop": 0,
                },

                // WALK
                "walk-f": {
                    "start": 0,
                    "length": 2,
                    "loop": 1,
                },
                "walk-fl": {
                    "start": 2,
                    "length": 2,
                    "loop": 2,
                },
                "walk-l": {
                    "start": 4,
                    "length": 2,
                    "loop": 1,
                },
                "walk-bl": {
                    "start": 6,
                    "length": 2,
                    "loop": 2,
                },
                "walk-b": {
                    "start": 8,
                    "length": 2,
                    "loop": 1,
                },
                "walk-br": {
                    "start": 10,
                    "length": 2,
                    "loop": 1,
                },
                "walk-r": {
                    "start": 12,
                    "length": 2,
                    "loop": 1,
                },
                "walk-fr": {
                    "start": 14,
                    "length": 2,
                    "loop": 1,
                },

                // ATTACK
                "attack-f": {
                    "start": 0,
                    "loop": 0,
                },
                "attack-fl": {
                    "start": 2,
                    "loop": 0,
                },
                "attack-l": {
                    "start": 4,
                    "loop": 0,
                },
                "attack-bl": {
                    "start": 6,
                    "loop": 0,
                },
                "attack-b": {
                    "start": 8,
                    "loop": 0,
                },
                "attack-br": {
                    "start": 10,
                    "loop": 0,
                },
                "attack-r": {
                    "start": 12,
                    "loop": 0,
                },
                "attack-fr": {
                    "start": 14,
                    "loop": 0,
                },

                // DEATH
                "death": {
                    "start": 16,
                    "length": 11,
                    "loop": 1,
                    "iterations": 1
                }
            }
        },

        "p-magbolt-0": {
            "src": "gfx/sprites/p_magbolt.png",
            "width": 64,
            "height": 64,
            "animations": {
                "fly-f": {
                    "start": 0,
                    "loop": 0
                },
                "fly-fl": {
                    "start": 1,
                    "loop": 0
                },
                "fly-l": {
                    "start": 2,
                    "loop": 0
                },
                "fly-bl": {
                    "start": 3,
                    "loop": 0
                },
                "fly-b": {
                    "start": 4,
                    "loop": 0
                },
                "fly-br": {
                    "start": 5,
                    "loop": 0
                },
                "fly-r": {
                    "start": 6,
                    "loop": 0
                },
                "fly-fr": {
                    "start": 7,
                    "loop": 0
                },

                "explode": {
                    "start": 8,
                    "loop": 0,
                    "length": 6,
                    "iterations": 1
                }
            }
        }
    }
};



function main() {
    // creates engine
    const engine = new Engine();

}