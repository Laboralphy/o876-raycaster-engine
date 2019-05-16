<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Animation builder"
    >
        <template v-slot:toolbar>
        </template>
        <table>
            <tbody>
                <tr>
                    <td>
                        <h3>Animation properties</h3>
                        <form>
                            <div>
                                <label>Frames: <input v-model="value.frames" type="number" min="2"/></label>
                            </div>
                            <div>
                                <label>Duration: <input v-model="value.duration" type="number" :min="getTimeInterval" :step="getTimeInterval"/></label>
                            </div>
                            <div>
                                <ul>
                                    <li v-for="p in getBlockBuilderAnimLoopData" :key="p.id">
                                        <label><input :value="p.id" v-model="value.loop" type="radio"/> {{ p.label }}</label>
                                    </li>
                                </ul>
                            </div>
                        </form>
                    </td>
                    <td>
                        <h3>Drag and drop a wall, flat or sprite texture here</h3>
                        <Tile
                                :tile="value.tile"
                                :content="getAnimationContent"
                                :width="width || Math.max(getTileWidth, getTileHeight)"
                                :height="height || Math.max(getTileWidth, getTileHeight)"
                                :selectable="false"
                                :dropzone="true"
                                @drop="({incoming}) => handleDrop(incoming)"
                        ></Tile>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <MyButton :disabled="saved" @click="doCreate"><AnimationIcon></AnimationIcon> Apply</MyButton>
                        <MyButton :disabled="!showUpdate" @click="doDelete"><DeleteIcon></DeleteIcon> Delete</MyButton>
                    </td>
                </tr>
            </tbody>
        </table>
    </Window>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex';
    import * as ACTION from '../store/modules/level/action-types';
    import * as MUTATION from '../store/modules/editor/mutation-types';
    import * as CONSTS from '../consts';

    // componentns
    import Window from "./Window.vue";
    import Tile from "./Tile.vue";
    import MyButton from "./MyButton.vue";
    import DeleteIcon from "vue-material-design-icons/Delete.vue";
    import UpdateIcon from "vue-material-design-icons/Update.vue";
    import AnimationIcon from "vue-material-design-icons/Animation.vue";
    import TileAnimation from "../../../../src/raycaster/TileAnimation";

    const {mapGetters: levelMapGetter, mapActions: levelMapActions} = createNamespacedHelpers('level');
    const {mapGetters: editorMapGetter, mapMutations: editorMapMutations} = createNamespacedHelpers('editor');

    export default {
        name: "AnimationBuilder",
        components: {AnimationIcon, UpdateIcon, DeleteIcon, MyButton, Tile, Window},


        data: function() {
            return {
                content: '',
                width: 0,
                height: 0,
                interval: null,
                timer: 0,
                frameIndex: 0,
                oTileAnimation: new TileAnimation(),
                saved: false,
                value: {
                    frames: 2,
                    duration: 120,
                    loop: 1,
                    tile: 0
                }
            };
        },

        watch: {
            'value.frames': {
                handler: function(newValue, oldValue) {
                    this.saved = false;
                    this.oTileAnimation.count = newValue;
                    this.oTileAnimation.reset();
                }
            },
            'value.duration': {
                handler: function(newValue, oldValue) {
                    this.saved = false;
                    this.oTileAnimation.duration = newValue;
                    this.oTileAnimation.reset();
                }
            },
            'value.loop': {
                handler: function(newValue, oldValue) {
                    this.saved = false;
                    this.oTileAnimation.loop = newValue;
                    this.oTileAnimation.reset();
                }
            },
            'value.tile': {
                handler: function(newValue, oldValue) {
                    this.saved = false;
                }
            }
        },

        computed: {
            ...levelMapGetter([
                'getTileWidth',
                'getTileHeight',
                'getTile',
                'getWallTiles',
                'getFlatTiles',
                'getSpriteTiles',
                'getTimeInterval'
            ]),

            ...editorMapGetter([
                'getBlockBuilderAnimLoopData'
            ]),

            isValidAnimation: function() {
                return !!this.value.tile && this.value.duration > 0 && this.value.frames > 1;
            },

            getAnimationContent: function() {
                if (this.isValidAnimation) {
                    const oFirstTile = this.getTile(this.value.tile);
                    const sType = oFirstTile.type;
                    let bWall = false;
                    let aTiles;
                    switch (sType) {
                        case CONSTS.TILE_TYPE_WALL:
                            aTiles = this.getWallTiles;
                            bWall = true;
                            break;

                        case CONSTS.TILE_TYPE_FLAT:
                            aTiles = this.getFlatTiles;
                            break;

                        case CONSTS.TILE_TYPE_SPRITE:
                            aTiles = this.getSpriteTiles;
                            break;
                    }
                    const iFirstFrame = aTiles.findIndex(t => t.id === this.value.tile);
                    const iFrame = this.frameIndex + iFirstFrame;
                    const oTile = iFrame < aTiles.length ? aTiles[iFrame] : aTiles[aTiles.length - 1];
                    const w = this.getTileWidth;
                    const h = bWall ? this.getTileHeight : this.getTileWidth;
                    this.width = w;
                    this.height = h;
                    return oTile.content;
                } else {
                    return this.content;
                }
            },

            /**
             * renvoie true si le bouton update doit etre montré, si on a droppé une texture ayant été
             * défini comme image initiale d'animation.
             */
            showUpdate: function() {
                const id = this.value.tile;
                const oTile = this.getTile(id);
                if (oTile) {
                    return !!oTile.animation;
                } else {
                    return false;
                }
            },
        },

        methods: {

            ...levelMapActions({
                setTileAnimation: ACTION.SET_TILE_ANIMATION,
                clearTileAnimation: ACTION.CLEAR_TILE_ANIMATION
            }),

            handleDrop: function(id) {
                const oTile = this.getTile(id);
                if (oTile) {
                    this.value.tile = id;
                    this.content = oTile.content;
                    this.width = this.getTileWidth;
                    this.height = oTile.type === CONSTS.TILE_TYPE_WALL ? this.getTileHeight : this.getTileWidth;
                    if (oTile.animation) {
                        this.value.duration = oTile.animation.duration;
                        this.value.loop = oTile.animation.loop;
                        this.value.frames = oTile.animation.frames;
                    } else {
                        this.value.duration = this.getTimeInterval * 2;
                        this.value.loop = 0;
                        this.value.frames = 2;
                    }
                } else {
                    console.error('this tile is undefined : ' + id)
                }
            },

            doomloop: function() {
                if (this.isValidAnimation) {
                    this.oTileAnimation.animate(40);
                    this.frameIndex = this.oTileAnimation.frame();
                }
            },

            /**
             * demarrage du timer
             */
            startTimer: function() {
                this.stopTimer();
                this.interval = setInterval(() => this.doomloop(), 40);
                const ta = this.oTileAnimation;
                ta.count = this.value.frames;
                ta.duration = this.value.duration;
                ta.loop = this.value.loop;
                ta.reset();
            },

            /**
             * arret du timer
             */
            stopTimer: function() {
                if (this.interval) {
                    clearInterval(this.interval);
                }
                this.interval = null;
            },

            doCreate: function() {
                // ajouter les donnée d'animation à la frame
                const oTile = this.getTile(this.value.tile);
                if (!!oTile) {
                    this.saved = true;
                    this.setTileAnimation({
                        start: this.value.tile,
                        duration: this.value.duration,
                        frames: this.value.frames,
                        loop: this.value.loop
                    });
                }
            },

            doDelete: function() {
                this.clearTileAnimation({idTile: this.value.tile});
            }
        },

        created: function() {
            this.startTimer();
        },

        beforeDestroy: function() {
            this.stopTimer();
        }
    }
</script>

<style scoped>

</style>