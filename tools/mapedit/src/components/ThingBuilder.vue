<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Thing Builder"
    >
        <template v-slot:toolbar>
        </template>
        <div>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <h3>Thing properties</h3>
                            <form>
                                <div>
                                    <label>Scale: <input v-model="mScale" type="number" />%</label>
                                    <div class="hint">Scale is a size factor. 200% means the thing will appear twice bigger</div>
                                </div>
                                <div>
                                    <label>Opacity:
                                        <select v-model="mOpacity">
                                            <option value="0">100%</option>
                                            <option value="1">75%</option>
                                            <option value="2">50%</option>
                                            <option value="3">25%</option>
                                        </select>
                                    </label>
                                    <div class="hint">Opacity 100% : the thing has full opacity. Opacity 25% : the thing is nearly transparent</div>
                                </div>
                                <div>
                                    <label>Light emitter: <input v-model="mLight" type="checkbox" /></label>
                                    <div class="hint">If checked, the thing will emit its own light and will never get darker when going afar from the point of view</div>
                                </div>
                                <div>
                                    <label>Ghost filter: <input v-model="mGhost" type="checkbox" /></label>
                                    <div class="hint">Apply an "Add color" filter. The thing will appear like a ghost. The effect is more relevant in dark areas</div>
                                </div>
                                <div>
                                    <label>Ref: <input v-model="mRef" style="width: 8em" type="text"/></label>
                                    <div class="hint">Optional symbolic identifier used during dev time</div>
                                </div>
                                <hr/>
                                <div>
                                    <MyButton v-if="!getThingBuilderId" @click="$emit('submitCreate', getData)">Create</MyButton>
                                    <MyButton v-else @click="$emit('submitUpdate', getData)">Update</MyButton>
                                </div>
                            </form>
                        </td>
                        <td>
                            <h3>Drag a tile here...</h3>
                            <Tile
                                    :tile="tile"
                                    :content="getAnimationContent"
                                    :width="width || Math.max(getTileWidth, getTileHeight)"
                                    :height="height || Math.max(getTileWidth, getTileHeight)"
                                    :selectable="false"
                                    :dropzone="true"
                                    @drop="({incoming}) => handleDrop(incoming)"
                            ></Tile>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Window>
</template>

<script>
    import * as EDITOR_MUTATION from '../store/modules/editor/mutation-types';
    import {createNamespacedHelpers} from 'vuex';

    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";


    const {mapGetters: editorMapGetters, mapMutations: editorMapMutations} = createNamespacedHelpers('editor');

    export default {
        name: "ThingBuilder",
        components: {MyButton, Window},

        data: function() {
            return {
                content: '',
                width: 0,
                height: 0,
                saved: false
            };
        },

        props: {
            id: {
                type: String,
                required: true
            }
        },

        watch: {
            id: {
                immediate: true,
                handler: function(newValue, oldValue) {
                    //....
                }
            }
        },

        computed: {
            ...editorMapGetters([
                'getThingBuilderId',
                'getThingBuilderScale',
                'getThingBuilderOpacity',
                'getThingBuilderLight',
                'getThingBuilderGhost',
                'getThingBuilderRef'
            ]),

            mScale: {
                get() {
                    return this.getThingBuilderScale;
                },
                set(value) {
                    this[EDITOR_MUTATION.THINGBUILDER_SET_SCALE]({value});
                }
            },
            mOpacity: {
                get() {
                    return this.getThingBuilderOpacity;
                },
                set(value) {
                    this[EDITOR_MUTATION.THINGBUILDER_SET_OPACITY]({value});
                }
            },
            mLight: {
                get() {
                    return this.getThingBuilderLight;
                },
                set(value) {
                    this[EDITOR_MUTATION.THINGBUILDER_SET_LIGHT]({value});
                }
            },
            mGhost: {
                get() {
                    return this.getThingBuilderGhost;
                },
                set(value) {
                    this[EDITOR_MUTATION.THINGBUILDER_SET_GHOST]({value});
                }
            },
            mRef: {
                get() {
                    return this.getThingBuilderRef;
                },
                set(value) {
                    this[EDITOR_MUTATION.THINGBUILDER_SET_REF]({value});
                }
            },

        },

        methods: {
            ...editorMapMutations([
                EDITOR_MUTATION.THINGBUILDER_SET_ID,
                EDITOR_MUTATION.THINGBUILDER_SET_SCALE,
                EDITOR_MUTATION.THINGBUILDER_SET_OPACITY,
                EDITOR_MUTATION.THINGBUILDER_SET_LIGHT,
                EDITOR_MUTATION.THINGBUILDER_SET_GHOST,
                EDITOR_MUTATION.THINGBUILDER_SET_REF
            ]),
        }
    };

    /*

    pour placer des objets dans le décor

    "objects": [...]
    {
        "x": 0,
        "y": 0,
        "angle": 0,
        "blueprint": "o-bluereddisc",
        "animation": "default"
    }

    "blueprints": [...]
    {
        "tileset": "o-bluereddisc",
        "thinker": 'StaticThinker',
        "size": 16
    }

    "tileset": [...]
    {
        "src": "gfx/sprites/o_bluereddisc.png",
        "width": 32,
        "height": 32,
        "fx": "@FX_NONE",
        "animations": {
            "default": {
                "start": 0,
                "length": 5,
                "loop": "@LOOP_YOYO",
                "duration": 160
            }
        }
    }

     */
</script>

<style scoped>

    input[type="number"] {
        width: 5em;
    }

    .hint {
        font-family: Arial,sans-serif;
        font-style: italic;
        color: rgb(64, 64, 64);
    }

    .hint:before {
        content: "(";
    }

    .hint:after {
        content: ")";
    }
</style>