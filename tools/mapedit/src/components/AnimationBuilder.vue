<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Animation builder"
    >
        <template v-slot:toolbar="1">
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
                                <label>Duration: <input v-model="duration" type="number" min="0"/></label>
                            </div>
                            <div>
                                <label>
                                    Loop:
                                    <select v-model="loop">
                                        <option v-for="p in getBlockBuilderAnimLoopData" :key="p.id" :value="p.id">{{ p.label }}</option>
                                    </select>
                                </label>
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
            </tbody>
        </table>
    </Window>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex';
    import * as MUTATION from '../store/modules/editor/mutation-types';
    import * as CONSTS from '../consts';

    // componentns
    import Window from "./Window.vue";
    import Tile from "./Tile.vue";

    const {mapGetters: levelMapGetter, mapActions: levelMapActions} = createNamespacedHelpers('level');
    const {mapGetters: editorMapGetter, mapMutations: editorMapMutations} = createNamespacedHelpers('editor');

    export default {
        name: "AnimationBuilder",
        components: {Tile, Window},


        data: function() {
            return {
                content: '',
                width: 0,
                height: 0,

                interval: null,
                timer: 0,

                frameIndex: 0,
                runAnimation: false
            };
        },

        computed: {
            ...levelMapGetter([
                'getTileWidth',
                'getTileHeight',
                'getTile',
                'getWallTiles',
                'getFlatTiles'
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
                }
            },

            duration: {
                get () {
                    return this.getAnimBuilderDuration;
                },

                set (value) {
                    this.setDuration({value});
                }
            },

            loop: {
                get () {
                    return this.getAnimBuilderLoop;
                },

                set (value) {
                    this.setLoop({value});
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
            }

        },

        methods: {

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
                }
            },

            doomloop: function() {
                if (this.isValidAnimation) {
                    this.timer += 40;
                    while (this.timer >= this.duration) {
                        this.frameIndex = (this.frameIndex + 1) % this.frames;
                        this.timer -= this.duration;
                    }
                }

            },

            /**
             * demarrage du timer
             */
            startTimer: function() {
                this.stopTimer();
                this.interval = setInterval(() => this.doomloop(), 40);
            },

            /**
             * arret du timer
             */
            stopTimer: function() {
                if (this.interval) {
                    clearInterval(this.interval);
                }
                this.interval = null;
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