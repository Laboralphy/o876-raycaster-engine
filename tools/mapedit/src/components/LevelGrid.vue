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

            <Siblings @input="selectTool">
                <SiblingButton
                        title="Select region"
                        :default="true"
                >
                    <SelectIcon
                            title="Select region"
                            decorative
                    ></SelectIcon>
                </SiblingButton>

                <SiblingButton
                        title="Draw blocks"
                >
                    <PencilIcon
                            title="Draw blocks"
                            decorative
                    ></PencilIcon>
                </SiblingButton>

            </Siblings>

            <Siblings @input="selectFloor">
                <SiblingButton
                        title="Lower floor"
                        :default="true"
                >
                    <ArrowDownBoldIcon
                            title="Lower floor"
                            decorative
                    ></ArrowDownBoldIcon>
                </SiblingButton>

                <SiblingButton
                        title="Upper floor"
                >
                    <ArrowUpBoldIcon
                            title="Upper floor"
                            decorative
                    ></ArrowUpBoldIcon>
                </SiblingButton>

            </Siblings>

        </template>
        <div ref="scrollzone" class="canvas-container" :style="'width: ' + containerWidth + 'px'">
            <canvas
                    ref="levelgrid"
                    :width="getGridSize * getCellSize"
                    :height="getGridSize * getCellSize"
                    @mousedown="mousedownEvent"
                    @mouseup="mouseupEvent"
                    @mousemove="mousemoveEvent"
            ></canvas>
        </div>
    </Window>
</template>

<script>
    import * as LEVEL_ACTION from '../store/modules/level/action-types';
    import * as EDITOR_ACTION from '../store/modules/editor/action-types';
    import * as EDITOR_MUTATION from '../store/modules/editor/mutation-types';
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
    import MarkerRegistry from "../../../../src/marker-registry";
    import Siblings from "./Siblings.vue";
    import SiblingButton from "./SiblingButton.vue";
    import SelectIcon from "vue-material-design-icons/Select.vue";
    import PencilIcon from "vue-material-design-icons/Pencil.vue";
    import ArrowUpBoldIcon from "vue-material-design-icons/ArrowUpBold.vue";
    import ArrowDownBoldIcon from "vue-material-design-icons/ArrowDownBold.vue";


    const {mapGetters: levelMapGetters, mapActions: levelMapActions} = createNamespacedHelpers('level');
    const {mapGetters: editorMapGetters, mapActions: editorMapActions, mapMutations: editorMapMutations} = createNamespacedHelpers('editor');

    export default {
        name: "LevelGrid",
        components: {
            ArrowDownBoldIcon,
            ArrowUpBoldIcon,
            PencilIcon,
            SelectIcon,
            SiblingButton,
            Siblings,
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
            Window
        },

        computed: {
            ...levelMapGetters([
                'getGridSize',
                'getGrid'
            ]),

            ...editorMapGetters([
                'getLevelGridSelectedRegion',
                'getBlockBrowserSelected',
            ]),

            getCellSize: function() {
                return this.gridRenderer.cellWidth;
            },
        },

        data: function() {
            return {
                gridRenderer: new GridRenderer(),
                containerWidth: 0,
                modifications: new MarkerRegistry(),
                selecting: false,
                selectedFloor: 0,
                selectedTool: 0,
                select: {
                    x: -1,
                    y: -1
                }
            };
        },

        watch: {
            getGrid: function(value) {
                this.redraw();
            }
        },


        methods: {
            ...levelMapActions({
                setGridSize: LEVEL_ACTION.SET_GRID_SIZE,
                saveLevel: LEVEL_ACTION.SAVE_LEVEL,
                loadLevel: LEVEL_ACTION.LOAD_LEVEL,
                setGridCell: LEVEL_ACTION.SET_GRID_CELL
            }),


            ...editorMapActions({
                setStatusBarText: EDITOR_ACTION.SET_STATUSBAR_TEXT,
                selectRegion: EDITOR_ACTION.SELECT_REGION,
            }),



            selectTool: function({index}) {
                console.log('tool is now', index);
                this.selectedTool = index;
            },

            selectFloor: function({index}) {
                this.selectedFloor = index;
            },

            invalidateRect: function(x1, y1, x2, y2) {
                if (x1 > x2) {
                    let a = x2;
                    x2 = x1;
                    x1 = a;
                }
                if (y1 > y2) {
                    let a = y2;
                    y2 = y1;
                    y1 = a;
                }
                for (let y = y1; y <= y2; ++y) {
                    for (let x = x1; x <= x2; ++x) {
                        if (x >= 0 && y >= 0) {
                            this.modifications.mark(x, y);
                        }
                    }
                }
            },



            redraw: function() {
                const a = this.modifications.toArray();
                this.modifications.clear();
                this.$nextTick(() => {
                    this.gridRenderer.render(this.$refs.levelgrid, this.getGrid, a.length > 0 ? a : undefined);
                });
            },


            resizeEvent() {
                this.$nextTick(() => {
                    const oCanvas = this.$refs.levelgrid;
                    const oScrollZone = this.$refs.scrollzone;
                    // save canvas display
                    const sDisplay = oCanvas.style.display;
                    oCanvas.style.display = 'none';
                    oScrollZone.style.width = '';
                    const w = oCanvas.parentNode.offsetWidth;
                    oCanvas.style.display = sDisplay;
                    oScrollZone.style.width = w + 'px';
                });
            },

            pixelToCell(x, y) {
                const nCellSize = this.getCellSize;
                const xc = Math.floor(x / nCellSize);
                const yc = Math.floor(y / nCellSize);
                return {x: xc, y: yc};
            },

            mousedownEvent(event) {
                const x = event.layerX;
                const y = event.layerY;
                const {x: xc, y: yc} = this.pixelToCell(x, y);
                const oPrevRegion = this.getLevelGridSelectedRegion;
                this.invalidateRect(oPrevRegion.x1, oPrevRegion.y1, oPrevRegion.x2, oPrevRegion.y2);
                this.selectRegion({x1: xc, y1: yc, x2: xc, y2: yc});
                this.invalidateRect(xc, yc, xc, yc);
                this.redraw();
                this.selecting = true;
                this.select.x = xc;
                this.select.y = yc;
            },

            mouseupEvent(event) {
                const x = event.layerX;
                const y = event.layerY;
                const {x: xc, y: yc} = this.pixelToCell(x, y);
                this.selecting = false;
                // déterminer si on est en mode "paint" avec un block selectionné
                console.log({xc, yc, tool: this.selectedTool, floor: this.selectedFloor, block: this.getBlockBrowserSelected});
                if (this.selectedTool === 1 && !!this.getBlockBrowserSelected) {
                    console.log({x: xc, y: yc, floor: this.selectedFloor, block: this.getBlockBrowserSelected});
                    const oPrevRegion = this.getLevelGridSelectedRegion;
                    this.invalidateRect(oPrevRegion.x1, oPrevRegion.y1, oPrevRegion.x2, oPrevRegion.y2);
                    this.modifications.iterate((cx, cy) => {
                        this.setGridCell({x: cx, y: cy, floor: this.selectedFloor, block: this.getBlockBrowserSelected});
                    });
                    this.selectRegion({x1: -1, y1: -1, x2: -1, y2: -1});
                    this.redraw();
                }
            },

            mousemoveEvent(event) {
                if (this.selecting) {
                    const x = event.layerX;
                    const y = event.layerY;
                    const {x: xc, y: yc} = this.pixelToCell(x, y);
                    const oPrevRegion = this.getLevelGridSelectedRegion;
                    if (xc !== oPrevRegion.x2 || yc !== oPrevRegion.y2) {
                        this.invalidateRect(oPrevRegion.x1, oPrevRegion.y1, oPrevRegion.x2, oPrevRegion.y2);
                        this.selectRegion({x1: this.select.x, y1: this.select.y, x2: xc, y2: yc});
                        this.invalidateRect(this.select.x, this.select.y, xc, yc);
                        this.redraw();
                    }
                }
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

                // code du block
                if (cell.block > 0) {
                    ctx.fillStyle = 'red';
                    ctx.fillRect(5, 5, 10, 10);
                }

                // peinture selection
                const {x1, y1, x2, y2} = this.getLevelGridSelectedRegion;
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
                this.setStatusBarText({text: 'Level saved : ' + sFileName});
            },

            loadClick: function() {
                this.$router.push('/list-levels');
            },

            /**
             * Grid shrinks : loses one row and one column
             */
            smallerGridClick: function() {
                this.setGridSize({value: Math.max(1, this.getGridSize - 1)});
            },

            /**
             * Grid grows : gain one row and one column
             */
            largerGridClick: function() {
                this.setGridSize({value: Math.min(256, this.getGridSize + 1)});
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