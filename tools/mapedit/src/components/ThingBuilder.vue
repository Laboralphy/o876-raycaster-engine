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
                                    <label>Scale: <input v-model="value.scale" type="number" />%</label>
                                    <div class="hint">Scale is a size factor. 200% means the thing will appear twice bigger.</div>
                                </div>
                                <div>
                                    <label>Opacity:
                                        <select v-model="value.opacity">
                                            <option value="0">100%</option>
                                            <option value="1">75%</option>
                                            <option value="2">50%</option>
                                            <option value="3">25%</option>
                                        </select>
                                    </label>
                                    <div class="hint">Opacity 100% : the thing has full opacity. Opacity 25% : the thing is nearly transparent.</div>
                                </div>
                                <div>
                                    <label>Light emitter: <input v-model="value.light" type="checkbox" /></label>
                                    <div class="hint">If checked, the thing will emit its own light and will never get darker when going afar from the point of view.</div>
                                </div>
                                <div>
                                    <label>Ghost filter: <input v-model="value.ghost" type="checkbox" /></label>
                                    <div class="hint">Apply an "Add color" filter. The thing will appear like a ghost. The effect is more relevant in dark areas.</div>
                                </div>
                                <div>
                                    <label>Ref: <input v-model="value.ref" style="width: 8em" type="text"/></label>
                                    <div class="hint">Optional symbolic identifier used during dev time.</div>
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
    import {createNamespacedHelpers} from 'vuex';

    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";


    const {mapGetters: editorMapGetters, mapMutations: editorMapMutations} = createNamespacedHelpers('editor');
    const {mapGetters: levelMapGetters} = createNamespacedHelpers('level');

    export default {
        name: "ThingBuilder",
        components: {MyButton, Window},

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
                    this.importThing(newValue);
                }
            }
        },

        data: function() {
            return {
                content: '',
                width: 0,
                height: 0,
                saved: false,

                value: {
                    scale: 100,
                    opacity: 0,
                    light: false,
                    ghost: false,
                    ref: ''
                }
            };
        },

        computed: {
            ...levelMapGetters([
                'getThings'
            ])
        },

        methods: {
            importThing: function(id) {
                id = id | 0;
                const oThing = this.getThings.find(t => t.id === id);
                if (oThing) {
                    this.value.scale = oThing.scale;
                    this.value.ghost = oThing.ghost;
                    this.value.light = oThing.light;
                    this.value.opacity = oThing.opacity;
                    this.value.ref = oThing.ref;
                }
            }
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