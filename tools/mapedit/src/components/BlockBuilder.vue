<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Block Builder"
    >
        <template v-slot:toolbar>
        </template>
        <div>
            <table>
                <tbody>
                    <tr>
                        <td class="form">
                            <form>
                                <h3>Physic properties</h3>
                                <div>
                                    <label>Phys:
                                        <select v-model="value.phys" class="w13em">
                                            <option v-for="p in getBlockBuilderPhysicalData" :key="p.id" :value="p.id">{{ p.label }}</option>
                                        </select>
                                    </label>
                                    <div class="hint">Block physical property</div>
                                </div>
                                <div>
                                    <label>Offs: <input v-model="value.offs" type="number" min="0" :max="getTileWidth"/></label>
                                    <div class="hint">Increasing this value creates an alcove, the higher value, the deeper.</div>
                                </div>
                                <div>
                                    <label>Light: <input v-model="value.light.enabled" type="checkbox"/></label>
                                </div>
                                <div>
                                    <div class="hint" v-show="!value.light.enabled">Check this on to open light properties panel</div>
                                    <fieldset v-show="value.light.enabled">
                                        <legend>Light source properties</legend>
                                        <p class="warning" v-if="value.phys !== CONSTS.PHYS_NONE && value.phys !== CONSTS.PHYS_TRANSPARENT_BLOCK && value.phys !== CONSTS.PHYS_INVISIBLE_BLOCK">
                                            The current "Phys" value is considered as "opaque". This block shall not let light pass throught it.<br />
                                            Thus, light source properties will be ignored, and no light will be emitted from this present block.<br />
                                            Choose Phys value among "Walkable", "Transparent" or "Invisible" to let light pass throught.
                                        </p>
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
                                    <label>Ref: <input style="width: 8em" v-model="value.ref" type="text"/></label>
                                    <div class="hint">Optional symbolic identifier used during dev time</div>
                                </div>
                                <hr/>
                                <div>
                                    <MyButton v-if="!getId" @click="createClick">Create</MyButton>
                                    <MyButton v-else @click="modifyClick">Update</MyButton>
                                </div>
                            </form>
                        </td>
                        <td class="tiles">
                            <h3>Drag tiles here...</h3>
                            <table class="block-def">
                                <tbody>
                                    <tr>
                                        <td colspan="4">
                                            <figure>
                                                <Tile
                                                        :tile="0"
                                                        :content="getFaceCeilingContent"
                                                        :width="getTileWidth"
                                                        :height="getTileWidth"
                                                        :selectable="false"
                                                        :dropzone="true"
                                                        :anim="getFaceCeilingAnim"
                                                        @drop="({incoming}) => handleDrop('c', incoming)"
                                                ></Tile>
                                                <figcaption>Ceiling
                                                    <span class="clear-button">
                                                        <CloseCircleIcon title="clear this placeholder" @click="clearTile('c')"></CloseCircleIcon>
                                                    </span></figcaption>
                                            </figure>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <figure>
                                                <Tile
                                                        :tile="0"
                                                        :content="getFaceWestContent"
                                                        :width="getTileWidth"
                                                        :height="getTileHeight"
                                                        :selectable="false"
                                                        :dropzone="true"
                                                        :anim="getFaceWestAnim"
                                                        @drop="({incoming}) => handleDrop('w', incoming)"
                                                ></Tile>
                                                <figcaption>West
                                                    <span class="dup-button">
                                                        <ContentDuplicateIcon title="duplicate this tile to all wall panels" @click="dupTile('w')"></ContentDuplicateIcon>
                                                    </span>
                                                    <span class="clear-button">
                                                        <CloseCircleIcon title="clear this placeholder" @click="clearTile('w')"></CloseCircleIcon>
                                                    </span>
                                                </figcaption>
                                            </figure>
                                        </td>
                                        <td>
                                            <figure>
                                                <Tile
                                                        :tile="0"
                                                        :content="getFaceNorthContent"
                                                        :width="getTileWidth"
                                                        :height="getTileHeight"
                                                        :selectable="false"
                                                        :dropzone="true"
                                                        :anim="getFaceNorthAnim"
                                                        @drop="({incoming}) => handleDrop('n', incoming)"
                                                ></Tile>
                                                <figcaption>North
                                                    <span class="dup-button">
                                                        <ContentDuplicateIcon title="duplicate this tile to all wall panels" @click="dupTile('n')"></ContentDuplicateIcon>
                                                    </span>
                                                    <span class="clear-button">
                                                        <CloseCircleIcon title="clear this placeholder" @click="clearTile('n')"></CloseCircleIcon>
                                                    </span>
                                                </figcaption>
                                            </figure>
                                        </td>
                                        <td>
                                            <figure>
                                                <Tile
                                                        :tile="0"
                                                        :content="getFaceSouthContent"
                                                        :width="getTileWidth"
                                                        :height="getTileHeight"
                                                        :selectable="false"
                                                        :dropzone="true"
                                                        :anim="getFaceSouthAnim"
                                                        @drop="({incoming}) => handleDrop('s', incoming)"
                                                ></Tile>
                                                <figcaption>South
                                                    <span class="dup-button">
                                                        <ContentDuplicateIcon title="duplicate this tile to all wall panels" @click="dupTile('s')"></ContentDuplicateIcon>
                                                    </span>
                                                    <span class="clear-button">
                                                        <CloseCircleIcon title="clear this placeholder" @click="clearTile('s')"></CloseCircleIcon>
                                                    </span>
                                                </figcaption>
                                            </figure>
                                        </td>
                                        <td>
                                            <figure>
                                                <Tile
                                                        :tile="0"
                                                        :content="getFaceEastContent"
                                                        :width="getTileWidth"
                                                        :height="getTileHeight"
                                                        :selectable="false"
                                                        :dropzone="true"
                                                        :anim="getFaceEastAnim"
                                                        @drop="({incoming}) => handleDrop('e', incoming)"
                                                ></Tile>
                                                <figcaption>East
                                                    <span class="dup-button">
                                                        <ContentDuplicateIcon title="duplicate this tile to all wall panels" @click="dupTile('e')"></ContentDuplicateIcon>
                                                    </span>
                                                    <span class="clear-button">
                                                        <CloseCircleIcon title="clear this placeholder" @click="clearTile('e')"></CloseCircleIcon>
                                                    </span>
                                                </figcaption>
                                            </figure>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="4">
                                            <figure>
                                                <Tile
                                                        :tile="0"
                                                        :content="getFaceFloorContent"
                                                        :width="getTileWidth"
                                                        :height="getTileWidth"
                                                        :selectable="false"
                                                        :dropzone="true"
                                                        :anim="getFaceFloorAnim"
                                                        @drop="({incoming}) => handleDrop('f', incoming)"
                                                ></Tile>
                                                <figcaption>Floor
                                                    <span class="clear-button">
                                                        <CloseCircleIcon title="clear this placeholder" @click="clearTile('f')"></CloseCircleIcon>
                                                    </span>
                                                </figcaption>
                                            </figure>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Window>

</template>

<script>
    import * as CONSTS from '../../../../lib/src/raycaster/consts';
    import * as ACTION from '../store/modules/level/action-types';
    // vuex
    import {createNamespacedHelpers} from 'vuex';
    import Window from "./Window.vue";
    import HomeButton from "./HomeButton.vue";
    import MyButton from "./MyButton.vue";
    import Tile from "./Tile.vue";
    import CloseCircleIcon from "vue-material-design-icons/CloseCircle.vue";
    import ContentDuplicateIcon from "vue-material-design-icons/ContentDuplicate.vue";

    const {mapGetters: levelMapGetter, mapActions: levelMapActions} = createNamespacedHelpers('level');
    const {mapGetters: editorMapGetter} = createNamespacedHelpers('editor');

    export default {
        name: "BlockBuilder",
        components: {ContentDuplicateIcon, CloseCircleIcon, Tile, MyButton, HomeButton, Window},

        data: function() {
            return {
                value: {
                    ref: 0,
                    phys: 0,
                    offs: 0,
                    light: {
                        enabled: false,
                        value: 0,
                        inner: 0,
                        outer: 0
                    },
                    faces: {
                        n: 0,
                        e: 0,
                        w: 0,
                        s: 0,
                        f: 0,
                        c: 0
                    }
                },
                CONSTS
            };
        },

        props: {
            id: {
                required: true,
                type: String
            }
        },

        watch: {
            id: {
                immediate: true,
                handler: function(newValue) {
                    this.importBlock(newValue);
                }
            }
        },



        computed: {
            ...levelMapGetter([
                'getTileHeight',
                'getTileWidth',
                'getWallTile',
                'getFlatTile',
                'getBlocks'
            ]),

            ...editorMapGetter([
                'getBlockBuilderPhysicalData'
            ]),


            getId: function() {
                return this.id | 0;
            },

            getFaceNorthAnim: function() {
                const idTile = this.value.faces.n;
                const oTile = this.getWallTile(idTile);
                if (!!oTile) {
                    return !!oTile.animation;
                } else {
                    return false;
                }
            },

            getFaceEastAnim: function() {
                const idTile = this.value.faces.e;
                const oTile = this.getWallTile(idTile);
                if (!!oTile) {
                    return !!oTile.animation;
                } else {
                    return false;
                }
            },

            getFaceWestAnim: function() {
                const idTile = this.value.faces.w;
                const oTile = this.getWallTile(idTile);
                if (!!oTile) {
                    return !!oTile.animation;
                } else {
                    return false;
                }
            },


            getFaceSouthAnim: function() {
                const idTile = this.value.faces.s;
                const oTile = this.getWallTile(idTile);
                if (!!oTile) {
                    return !!oTile.animation;
                } else {
                    return false;
                }
            },


            getFaceFloorAnim: function() {
                const idTile = this.value.faces.f;
                const oTile = this.getWallTile(idTile);
                if (!!oTile) {
                    return !!oTile.animation;
                } else {
                    return false;
                }
            },


            getFaceCeilingAnim: function() {
                const idTile = this.value.faces.c;
                const oTile = this.getWallTile(idTile);
                if (!!oTile) {
                    return !!oTile.animation;
                } else {
                    return false;
                }
            },

            getFaceNorthContent: function() {
                const idTile = this.value.faces.n;
                const oTile = this.getWallTile(idTile);
                if (!!oTile) {
                    return oTile.content;
                } else {
                    return '';
                }
            },

            getFaceWestContent: function() {
                const idTile = this.value.faces.w;
                const oTile = this.getWallTile(idTile);
                if (!!oTile) {
                    return oTile.content;
                } else {
                    return '';
                }
            },

            getFaceEastContent: function() {
                const idTile = this.value.faces.e;
                const oTile = this.getWallTile(idTile);
                if (!!oTile) {
                    return oTile.content;
                } else {
                    return '';
                }
            },

            getFaceSouthContent: function() {
                const idTile = this.value.faces.s;
                const oTile = this.getWallTile(idTile);
                if (!!oTile) {
                    return oTile.content;
                } else {
                    return '';
                }
            },

            getFaceFloorContent: function() {
                const idTile = this.value.faces.f;
                const oTile = this.getFlatTile(idTile);
                if (!!oTile) {
                    return oTile.content;
                } else {
                    return '';
                }
            },

            getFaceCeilingContent: function() {
                const idTile = this.value.faces.c;
                const oTile = this.getFlatTile(idTile);
                if (!!oTile) {
                    return oTile.content;
                } else {
                    return '';
                }
            },
        },

        methods: {
            ...levelMapActions({
                createBlock: ACTION.CREATE_BLOCK,
                modifyBlock: ACTION.MODIFY_BLOCK
            }),

            importBlock: function(id) {
                id = id | 0;
                const oBlock = this.getBlocks.find(b => b.id === id);
                if (!!oBlock) {
                    this.value.ref = oBlock.ref;
                    this.value.phys = oBlock.phys;
                    this.value.offs = oBlock.offs;
                    this.value.light.enabled = oBlock.light.enabled;
                    this.value.light.value = oBlock.light.value;
                    this.value.light.inner = oBlock.light.inner;
                    this.value.light.outer = oBlock.light.outer;
                    this.value.faces.n = oBlock.faces.n;
                    this.value.faces.e = oBlock.faces.e;
                    this.value.faces.w = oBlock.faces.w;
                    this.value.faces.s = oBlock.faces.s;
                    this.value.faces.f = oBlock.faces.f;
                    this.value.faces.c = oBlock.faces.c;
                } else {
                    this.value.ref = '';
                    this.value.phys = 0;
                    this.value.offs = 0;
                    this.value.light.enabled = false;
                    this.value.light.value = 0;
                    this.value.light.inner = 0;
                    this.value.light.outer = 0;
                    this.value.faces.n = null;
                    this.value.faces.e = null;
                    this.value.faces.w = null;
                    this.value.faces.s = null;
                    this.value.faces.f = null;
                    this.value.faces.c = null;
                }
            },

            handleDrop: function(face, id) {
                this.value.faces[face] = id | 0;
            },

            clearTile: function(face) {
                this.value.faces[face] = null;
            },

            dupTile: function(face) {
                let c;
                switch (face) {
                    case 'n':
                        c = this.value.faces.n;
                        break;

                    case 'e':
                        c = this.value.faces.e;
                        break;

                    case 'w':
                        c = this.value.faces.w;
                        break;

                    case 's':
                        c = this.value.faces.s;
                        break;
                }
                this.value.faces.n = c;
                this.value.faces.e = c;
                this.value.faces.w = c;
                this.value.faces.s = c;
            },

            createClick: function() {
                this.createBlock(this.value).then(() => this.$router.push('/level/blocks'));
            },

            modifyClick: function() {
                const id = this.getId;
                this.modifyBlock({id, ...this.value}).then(() => {
                    this.$router.push('/level/blocks');
                });
            }
        }
    }
</script>

<style scoped>
    .form input[type="number"] {
        width: 4em;
    }

    td.tiles table.block-def td {
        text-align: center;
    }

    figure {
        margin: 1.2em;
    }

    figure span.clear-button {
        color: #A00;
        font-size: 1.3em;
        cursor: pointer;
    }

    figure span.clear-button:hover {
        color: #F00;
    }

    figure span.dup-button {
        color: #0000FF;
        font-size: 1.3em;
        cursor: pointer;
    }

    figure span.dup-button:hover {
        color: #06F;
    }

    input[type="number"] {
        width: 5em;
    }

    select.w13em {
        width: 13em;
    }

    select.w8em {
        width: 8em;
    }

    p.warning {
        color: red;
        font-weight: bold;
        font-size: 0.95em;
    }
</style>