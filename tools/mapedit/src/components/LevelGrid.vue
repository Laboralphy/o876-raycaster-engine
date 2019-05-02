<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
        caption="Level grid"
    >
        <template v-slot:toolbar>


            <MyButton
                    title="Save level"
                    @click="saveClick"
            >
                <ContentSaveIcon
                        title="Save level"
                        decorative>
                </ContentSaveIcon>
            </MyButton>


            <MyButton
                    title="Load level"
                    @click="loadClick"
            >
                <FolderOpenIcon
                        title="Load level"
                        decorative>
                </FolderOpenIcon>
            </MyButton>


            <MyButton
                    title="Decrease grid size (-1 row & column)"
                    @click="smallerGridClick"
            >
                <ArrowCollapseIcon
                        title="Decrease grid size (-1 row & column)"
                        decorative>
                </ArrowCollapseIcon>
            </MyButton>


            <MyButton
                    title="Augment grid size (+1 row & column)"
                    @click="largerGridClick"
            >
                <ArrowExpandIcon
                        title="Augment grid size (+1 row & column)"
                        decorative>
                </ArrowExpandIcon>
            </MyButton>

            <MyButton
                    title="Zoom out"
                    @click="zoomOutClick"
            >
                <MagnifyMinusIcon
                        title="Zoom out"
                        decorative>
                </MagnifyMinusIcon>
            </MyButton>

            <MyButton
                    title="Zoom in"
                    @click="zoomInClick"
            >
                <MagnifyPlusIcon
                        title="Zoom in"
                        decorative>
                </MagnifyPlusIcon>
            </MyButton>

        </template>
        <div ref="scrollzone" class="canvas-container" :style="'width: ' + containerWidth + 'px'">
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
    import * as LEVEL_ACTION from '../store/modules/level/action-types';
    import * as EDITOR_ACTION from '../store/modules/editor/action-types';
    import {createNamespacedHelpers} from 'vuex';
    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import MapIcon from "vue-material-design-icons/Map.vue";
    import OfficeBuildingIcon from "vue-material-design-icons/OfficeBuilding.vue";
    import Tile from "./Tile.vue";
    import GridRenderer from "../libraries/grid-renderer";
    import ArrowCollapseIcon from "vue-material-design-icons/ArrowCollapse.vue";
    import ArrowExpandIcon from "vue-material-design-icons/ArrowExpand.vue";
    import MagnifyPlusIcon from "vue-material-design-icons/MagnifyPlus.vue";
    import MagnifyMinusIcon from "vue-material-design-icons/MagnifyMinus.vue";
    import ContentSaveIcon from "vue-material-design-icons/ContentSave.vue";
    import FolderOpenIcon from "vue-material-design-icons/FolderOpen.vue";


    const {mapGetters: levelMapGetters, mapActions: levelMapActions} = createNamespacedHelpers('level');
    const {mapGetters: editorMapGetters, mapActions: editorMapActions} = createNamespacedHelpers('editor');

    export default {
        name: "LevelGrid",
        components: {
            FolderOpenIcon,
            ContentSaveIcon,
            MagnifyMinusIcon,
            MagnifyPlusIcon,
            ArrowExpandIcon,
            ArrowCollapseIcon,
            Tile,
            MapIcon,
            OfficeBuildingIcon,
            MyButton,
            Window},

        computed: {
            ...levelMapGetters([
                'getGridSize',
                'getGrid'
            ]),

            ...editorMapGetters([
                'getSelectedRegion'
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
                setGridSize: LEVEL_ACTION.SET_GRID_SIZE,
                saveLevel: LEVEL_ACTION.SAVE_LEVEL,
                loadLevel: LEVEL_ACTION.LOAD_LEVEL,
            }),


            ...editorMapActions({
                listLevel: EDITOR_ACTION.LIST_LEVELS
            }),


            redraw: function() {
                this.$nextTick(() => this.gridRenderer.render(this.$refs.levelgrid, this.getGrid));
            },


            resizeEvent() {
                this.$nextTick(() => {
                    const oCanvas = this.$refs.levelgrid;
                    const oScrollZone = this.$refs.scrollzone;
                    // save canvas display
                    const sDisplay = oCanvas.style.display;
                    oCanvas.style.display = 'none';
                    // previously : $scrollzone.width('');
                    oScrollZone.style.width = '';
                    // previously : var w = $canvas.parent().width();
                    const w = oCanvas.parentNode.offsetWidth;
                    // previously : $canvas.show();
                    oCanvas.style.display = sDisplay;
                    // previously : $scrollzone.width(w);
                    oScrollZone.style.width = w + 'px';

                    //console.log(this.$refs.scrollzone.parentNode.offsetWidth);
                    //this.containerWidth = 500; //this.$refs.container.parentNode.offsetWidth;
                });
            },

            mousedownEvent(event) {

            },

            /**
             * this function is called for each redrawing cell
             * @param x {number} cell coordinate (x)
             * @param y {number} cell coordinate (y)
             * @param canvas {HTMLCanvasElement} a canvas, the siez of a cell
             * @param cell {*} cell data
             */
            paintEvent: function({x, y, canvas, cell}) {
                const ctx = canvas.getContext('2d');
                const w = canvas.width;
                const h = canvas.height;
                ctx.fillStyle = 'red';
                ctx.fillRect(w - 15, h - 15, 15, 15);

                // peinture selection
                const {x1, y1, x2, y2} = this.getSelectedRegion;
                const bSelected = x >= x1 && x <= x2 && y >= y1 && y <= y2;
                if (bSelected) {
                    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
                    ctx.fillRect(0, 0, w, h);
                }
            },

            /**
             * Save the level
             */
            saveClick: function() {
                const sFileName = prompt('Enter a filename');
                this.saveLevel({name: sFileName});
            },

            loadClick: function() {
                this.listLevel();
            },

            /**
             * Grid shrinks : loses one row and one column
             */
            smallerGridClick: function() {
                this.setGridSize({value: Math.max(1, this.getGridSize - 1)}).then(() => this.redraw());
            },

            /**
             * Grid grows : gain one row and one column
             */
            largerGridClick: function() {
                this.setGridSize({value: Math.min(256, this.getGridSize + 1)}).then(() => this.redraw());
            },

            /**
             * zoom the grid out : each cell becomes smaller, you can see a larger level area
             */
            zoomOutClick: function() {
                this.gridRenderer.zoomOut();
                this.redraw();
            },

            /**
             * zoom the grid in : each cell becomes smaller, and you can see each cell more precisely
             */
            zoomInClick: function() {
                this.gridRenderer.zoomIn();
                this.redraw();
            }
        },

        mounted: function() {
            this.gridRenderer.events.on('paint', this.paintEvent);
            this.$nextTick(function() {
                window.addEventListener('resize', this.resizeEvent);
                this.resizeEvent();
                this.redraw();
            });

        },

        beforeDestroy: function() {
            window.removeEventListener('resize', this.resizeEvent);
            this.gridRenderer.events.removeListener('paint', this.paintEvent);
        }
    }
</script>

<style scoped>
    div.canvas-container canvas {
        position: relative;
        display: inline;
    }

    div.canvas-container {
        box-sizing: border-box;
        height: 100%;
        overflow: scroll;
    }
</style>