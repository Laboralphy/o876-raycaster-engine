<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
        caption="Level grid"
    >
        <template v-slot:toolbar>
            <MyButton title="Decrease size 1 row" @click="smallerGridClick"><ResizeIcon title="Decrease size 1 row" decorative></ResizeIcon>--</MyButton>
            <MyButton title="Augment size 1 row" @click="largerGridClick"><ResizeIcon title="Augment size 1 row" decorative></ResizeIcon>++</MyButton>
        </template>
        <div ref="container" class="canvas-container" :style="'width: ' + containerWidth + 'px'">
            <canvas
                    ref="levelgrid"
                    :width="getGridSize * getCellSize"
                    :height="getGridSize * getCellSize"
                    @mousedown="mousedownEvent"
            ></canvas>
        </div>
    </Window>
</template>

<script>
    import * as ACTION from '../store/modules/level/action-types';
    import {createNamespacedHelpers} from 'vuex';
    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import MapIcon from "vue-material-design-icons/Map.vue";
    import OfficeBuildingIcon from "vue-material-design-icons/OfficeBuilding.vue";
    import FilmstripIcon from "vue-material-design-icons/Filmstrip.vue";
    import Tile from "./Tile.vue";
    import ResizeIcon from "vue-material-design-icons/Resize.vue";
    import GridRenderer from "../libraries/grid-renderer";


    const {mapGetters: levelMapGetters, mapActions: levelMapActions} = createNamespacedHelpers('level');

    export default {
        name: "LevelGrid",
        components: {ResizeIcon, Tile, FilmstripIcon, MapIcon, OfficeBuildingIcon, MyButton, Window},

        computed: {
            ...levelMapGetters([
                'getGridSize',
                'getGrid'
            ]),

            getCellSize: function() {
                return this.gridRenderer.cellWidth;
            }
        },

        data: function() {
            return {
                gridRenderer: new GridRenderer(),
                containerWidth: 0
            };
        },

        watch: {
            getGridSize: function(value) {

            }
        },

        methods: {
            ...levelMapActions({
                setGridSize: ACTION.SET_GRID_SIZE
            }),

            redraw: function() {
                this.gridRenderer.render(this.$refs.levelgrid, this.getGrid);
            },

            smallerGridClick: async function() {
                await this.setGridSize({value: Math.max(1, this.getGridSize - 1)});
                this.redraw();
            },

            largerGridClick: async function() {
                await this.setGridSize({value: Math.min(256, this.getGridSize + 1)});
                this.redraw();
            },

            resizeEvent() {
                this.containerWidth = this.$refs.container.parentNode.offsetWidth;
            },

            mousedownEvent(event) {

            }
        },

        mounted: function() {
            this.$nextTick(function() {
                window.addEventListener('resize', this.resizeEvent);
                this.resizeEvent();
            });
        },

        beforeDestroy: function() {
            window.removeEventListener('resize', this.resizeEvent);
        }
    }
</script>

<style scoped>
    div.canvas-container canvas {
        position: relative;
    }

    div.canvas-container {
        box-sizing: border-box;
        height: 100%;
        overflow: scroll;
    }
</style>