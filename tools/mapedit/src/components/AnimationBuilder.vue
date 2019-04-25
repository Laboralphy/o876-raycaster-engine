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
                                <label>Frames: <input v-model="frames" type="number" min="2"/></label>
                            </div>
                            <div>
                                <label>Duration: <input v-model="duration" type="number" :min="getTimeInterval" :step="getTimeInterval"/></label>
                            </div>
                            <div>
                                <ul>
                                    <li v-for="p in getBlockBuilderAnimLoopData" :key="p.id">
                                        <label><input :value="p.id" v-model="loop" type="radio"/> {{ p.label }}</label>
                                    </li>
                                </ul>
                            </div>
                        </form>
                    </td>
                    <td>
                        <h3>Drag and drop a wall or flat texture here</h3>
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
                <tr>
                    <td colspan="2">
                        <MyButton @click="doCreate"><AnimationIcon></AnimationIcon> Apply</MyButton>
                        <MyButton @click="doDelete" :disabled="!showUpdate"><DeleteIcon></DeleteIcon> Delete</MyButton>
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

                oTileAnimation: new TileAnimation()
            };
        },

        computed: {
            ...levelMapGetter([
                'getTileWidth',
                'getTileHeight',
                'getTile',
                'getWallTiles',
                'getFlatTiles',
                'getTimeInterval'
            ]),

            ...editorMapGetter([
                'getBlockBuilderAnimLoopData',
                'getAnimBuilderFrames',
                'getAnimBuilderDuration',
                'getAnimBuilderLoop',
                'getAnimBuilderStart'
            ]),

            tile: {
                get () {
                    return this.getAnimBuilderStart;
                },

                set (value) {
                    this.setStart({value});
                }
            },

            frames: {
                get () {
                    return this.getAnimBuilderFrames;
                },

                set (value) {
                    this.setFrames({value});
                    this.oTileAnimation.count = parseInt(value);
                }
            },

            duration: {
                get () {
                    return this.getAnimBuilderDuration;
                },

                set (value) {
                    this.setDuration({value});
                    this.oTileAnimation.duration = parseInt(value);
                }
            },

            loop: {
                get () {
                    return this.getAnimBuilderLoop;
                },

                set (value) {
                    this.setLoop({value});
                    this.oTileAnimation.loop = parseInt(value);
                }
            },

            isValidAnimation: function() {
                return !!this.tile && this.duration > 0 && this.frames > 1;
            },

            getAnimationContent: function() {
                if (this.isValidAnimation) {
                    const oFirstTile = this.getTile(this.tile);
                    const sType = oFirstTile.type;
                    const bWall = sType === CONSTS.TILE_TYPE_WALL;
                    const aTiles = bWall ? this.getWallTiles : this.getFlatTiles;
                    const iFirstFrame = aTiles.findIndex(t => t.id === this.tile);
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
                const id = this.tile;
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

            ...editorMapMutations({
                setStart: MUTATION.ANIMBUILDER_SET_START,
                setFrames: MUTATION.ANIMBUILDER_SET_FRAMES,
                setDuration: MUTATION.ANIMBUILDER_SET_DURATION,
                setLoop: MUTATION.ANIMBUILDER_SET_LOOP
            }),

            handleDrop: function(id) {
                const oTile = this.getTile(id);
                if (oTile) {
                    this.tile = id;
                    this.content = oTile.content;
                    this.width = this.getTileWidth;
                    this.height = oTile.type === CONSTS.TILE_TYPE_WALL ? this.getTileHeight : this.getTileWidth;
                    if (oTile.animation) {
                        this.duration = oTile.animation.duration;
                        this.loop = oTile.animation.loop;
                        this.frames = oTile.animation.frames;
                    } else {
                        this.duration = this.getTimeInterval * 2;
                        this.loop = 0;
                        this.frames = 2;
                    }
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
                ta.count = this.frames;
                ta.duration = this.duration;
                ta.loop = this.loop;
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
                const animation = {
                    start: this.tile,
                    frames: this.frames,
                    duration: this.duration,
                    loop: this.loop
                };
                const oTile = this.getTile(this.tile);
                if (!!oTile) {
                    this.setTileAnimation(animation);
                }
            },

            doDelete: function() {
                this.clearTileAnimation({idTile: this.tile});
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