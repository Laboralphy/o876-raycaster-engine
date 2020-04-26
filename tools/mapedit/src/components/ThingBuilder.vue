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
                                    <label>Opacity:
                                        <select v-model="value.opacity">
                                            <option value="0">100%</option>
                                            <option value="1">75%</option>
                                            <option value="2">50%</option>
                                            <option value="3">25%</option>
                                        </select>
                                    </label>
                                    <div class="hint">Opacity 100% : the thing has full opacity. Opacity 25% : the thing is nearly transparent</div>
                                </div>
                                <div>
                                    <label>Light emitter: <input v-model="value.light.enabled" type="checkbox" /></label>
                                    <div class="hint">If checked, the thing will emit its own light and will never get darker when going afar from the point of view.</div>
                                    <fieldset v-show="value.light.enabled">
                                        <legend>Light source properties</legend>
                                        <div>
                                            <label>Intensity: <input v-model="value.light.value" type="number" min="0" max="1" step="0.01"/></label>
                                        </div>
                                        <div>
                                            <label>In.rad.: <input v-model="value.light.inner" type="number" min="0"/></label>
                                        </div>
                                        <div>
                                            <label>Out.rad.: <input v-model="value.light.outer" type="number" min="0"/></label>
                                        </div>
                                    </fieldset>
                                </div>
                                <div>
                                    <label>Ghost filter: <input v-model="value.ghost" type="checkbox" /></label>
                                    <div class="hint">Apply an "Add color" filter. The thing will appear like a ghost. The effect is more relevant in dark areas.</div>
                                </div>
                                <div>
                                    <label>Obstacle flag: <input v-model="value.tangible" type="checkbox" /></label>
                                    <div class="hint">If checked, the thing will be tangible and will affect (block) any colliding things.</div>
                                </div>
                                <div v-if="value.tangible">
                                    <label>Physical size: <input v-model="value.size" type="number" min="1" /></label>
                                    <div class="hint">The physical size is used when the tangible flag is set to true.</div>
                                </div>
                                <div>
                                    <label>Ref: <input v-model="value.ref" style="width: 8em" type="text"/></label>
                                    <div class="hint">Optional symbolic identifier used during dev time.</div>
                                </div>
                                <hr/>
                                <div>
                                    <MyButton @click="doCreate">{{ !getId ? 'Create' : 'Update' }}</MyButton>
                                </div>
                            </form>
                        </td>
                        <td>
                            <h3>Drag a tile here...</h3>
                            <Tile
                                    :tile="value.tile"
                                    :content="content"
                                    :width="96"
                                    :height="96"
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
    import * as CONSTS from '../consts';
    import * as RC_CONSTS from '../../../../libs/raycaster/consts';

    import * as LEVEL_ACTION from '../store/modules/level/action-types';

    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import Tile from "./Tile.vue";

    const {mapGetters: levelMapGetters, mapActions: levelMapActions} = createNamespacedHelpers('level');

    export default {
        name: "ThingBuilder",
        components: {MyButton, Window, Tile},

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
                saved: false,
                CONSTS,
                RC_CONSTS,
                value: {
                    tile: 0,
                    tangible: false,
                    size: 1,
                    opacity: 0,
                    light: {
                        enabled: false,
                        value: 0,
                        inner: 0,
                        outer: 0
                    },
                    ghost: false,
                    ref: ''
                }
            };
        },


        computed: {
            ...levelMapGetters([
                'getThing',
                'getTile'
            ]),


            getId: function() {
                return this.id | 0
            }
        },

        methods: {

            ...levelMapActions({
                createThing: LEVEL_ACTION.CREATE_THING,
                modifyThing: LEVEL_ACTION.MODIFY_THING
            }),

            importThing: function(id) {
                id = id | 0;
                const oThing = this.getThing(id);
                if (oThing) {
                    const oTile = this.getTile(oThing.tile);
                    this.value.ghost = oThing.ghost;
                    this.value.tangible = oThing.tangible;
                    this.value.light = oThing.light;
                    this.value.size = oThing.size;
                    this.value.opacity = oThing.opacity;
                    this.value.ref = oThing.ref;
                    this.value.tile = oThing.tile;
                    this.content = oTile.content;
                }
            },

            handleDrop: function(id) {
                const oTile = this.getTile(id);
                if (oTile) {
                    if (oTile.type !== CONSTS.TILE_TYPE_SPRITE) {
                        alert('Only sprite tiles are allowed here !');
                        return;
                    }
                    this.value.tile = id;
                    this.content = oTile.content;
                } else {
                    console.error('this tile is undefined : ' + id);
                }
            },


            doCreate: function() {
                const oTile = this.getTile(this.value.tile);
                if (!!oTile) {
                    this.saved = true;
                    const id = this.getId | 0;
                    if (!id) {
                        this.createThing(this.value).then(() => this.$router.push('/level/things'));
                    } else {
                        this.modifyThing({id, ...this.value}).then(() => this.$router.push('/level/things'));
                    }
                }
            },
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

</style>