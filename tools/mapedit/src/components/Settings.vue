<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Settings"
    >
        <template v-slot:toolbar>
        </template>
        <form>
            <div>
                <label>Tile width:
                        <input v-model="value.tileWidth" type="number" min="1"/>
                </label>
                <div class="hint">Tile width in pixels</div>
            </div>
            <div>
                <label>Tile height:
                    <input v-model="value.tileHeight" type="number" min="1"/>
                </label>
                <div class="hint">Tile height in pixels, from floor to ceiling</div>
            </div>
            <div>
                <label>Texture smoothing:
                    <input v-model="value.flagSmooth" type="checkbox" />
                </label>
                <div class="hint">If checked, the wall texture rendering will be smoothed, else, it will be pixelated</div>
            </div>
            <div>
                <label>Second story texture stretching:
                    <input v-model="value.flagStretch" type="checkbox" />
                </label>
                <div class="hint">If checked, the second story wall textures will be stretched, and will appear twice taller.</div>
            </div>
            <div>
                <MyButton :disabled="indicator.length > 0" @click="applyClicked">Apply</MyButton> {{ indicator }}
            </div>
            <h3>Warning</h3>
            <p style="color: darkred; font-weight: bold">
                Changing tile width will resize all existing tiles and affect texture resolution and quality.
                It will also modify all metrics, block light radius values, block offsets, and thing physical size.
            </p>
            <p>
                Setting tile width (and height) should be the very first operation you do just after starting a new level from scratch.
            </p>
        </form>
    </Window>
</template>

<script>
    import * as LEVEL_ACTION from '../store/modules/level/action-types';
    import {createNamespacedHelpers} from 'vuex';

    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import CanvasHelper from "../../../../src/canvas-helper/CanvasHelper";

    const {mapGetters: levelMapGetters, mapActions: levelMapAction} = createNamespacedHelpers('level');


    export default {
        name: "Settings",
        components: {MyButton, Window},

        data: function() {
            return {
                value: {
                    tileWidth: 64,
                    tileHeight: 96,
                    flagSmooth: false,
                    flagStretch: false
                },

                indicator: ''
            };
        },

        computed: {
            ...levelMapGetters([
                'getTileWidth',
                'getTileHeight',
                'getFlagSmooth',
                'getFlagStretch',
                'getTiles'
            ])
        },

        methods: {
            ...levelMapAction({
                setFlag: LEVEL_ACTION.SET_FLAG,
                setTileWidth: LEVEL_ACTION.SET_TILE_WIDTH,
                setTileHeight: LEVEL_ACTION.SET_TILE_HEIGHT,
                replaceTileContent: LEVEL_ACTION.REPLACE_TILE_CONTENT,
                replaceBlockOffset: LEVEL_ACTION.FEEDBACK_TILE_WIDTH
            }),

            resizeCanvas: function(canvas, w, h) {
                return new Promise(resolve => {
                    const oOutput = CanvasHelper.createCanvas(w, h);
                    const oContext = oOutput.getContext('2d');
                    oContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, w, h);
                    resolve(CanvasHelper.getData(oOutput));
                });
            },



            applyClicked: async function() {
                this.indicator = 'resizing tiles...';
                const tiles = this.getTiles;
                const w = this.value.tileWidth | 0;
                const h = this.value.tileHeight | 0;
                const prevWidth = this.getTileWidth;
                const prevHeight = this.getTileHeight;
                if (w !== prevWidth || h !== prevHeight) {
                    const proms = tiles.walls.map(tile =>
                        CanvasHelper.loadCanvas(tile.content)
                            .then(canvas => this.resizeCanvas(canvas, w, h))
                            .then(content => this.replaceTileContent({id: tile.id, type: 'walls', content}))
                    ).concat(tiles.flats.map(tile =>
                        CanvasHelper.loadCanvas(tile.content)
                            .then(canvas => this.resizeCanvas(canvas, w, h))
                            .then(content => this.replaceTileContent({id: tile.id, type: 'flats', content}))
                    ));
                    await Promise.all(proms);
                    await this.setTileWidth({value: w});
                    await this.setTileHeight({value: h});
                }
                await this.setFlag({flag: 'smooth', value: !!this.value.flagSmooth});
                await this.setFlag({flag: 'stretch', value: !!this.value.flagStretch});
                this.indicator = '';
                this.$router.push('/level/blocks');
            }
        },

        mounted: function() {
            this.value.tileWidth = this.getTileWidth;
            this.value.tileHeight = this.getTileHeight;
            this.value.flagSmooth = this.getFlagSmooth;
            this.value.flagStretch = this.getFlagStretch;
        }
    }
</script>

<style scoped>

</style>