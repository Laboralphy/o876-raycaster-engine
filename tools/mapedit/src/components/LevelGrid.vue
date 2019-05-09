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

            <MyButton
                    title="Undo"
                    @click="undo"
                    :disabled="getLevelGridTopMostUndo.length === 0"
            >
                <UndoIcon
                        title="Undo"
                        decorative>
                </UndoIcon>
            </MyButton>

            <MyButton
                    title="Copy"
                    @click="copyClick"
                    :disabled="!isRegionSelected"
            >
                <ContentCopyIcon
                        title="Copy"
                        decorative>
                </ContentCopyIcon>
            </MyButton>

            <MyButton
                    title="Paste"
                    @click="pasteClick"
                    :disabled="clipboard === null && !isRegionSelected"
            >
                <ContentPasteIcon
                        title="Paste"
                        decorative>
                </ContentPasteIcon>
            </MyButton>

            <MyButton
                    title="Clear"
                    @click="clearClick"
                    :disabled="!isRegionSelected"
            >
                <CloseIcon
                        title="Clear"
                        decorative>
                </CloseIcon>
            </MyButton>

        </template>
        <div
                ref="scrollzone"
                class="canvas-container"
                :style="'width: ' + containerWidth + 'px'"
        >
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
    import * as LEVEL_MUTATION from '../store/modules/level/mutation-types';
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
    import BlockCache from "../libraries/block-cache";
    import UndoIcon from "vue-material-design-icons/Undo.vue";
    import ContentCopyIcon from "vue-material-design-icons/ContentCopy.vue";
    import ContentPasteIcon from "vue-material-design-icons/ContentPaste.vue";
    import CloseIcon from "vue-material-design-icons/Close.vue";


    const {mapGetters: levelMapGetters, mapActions: levelMapActions, mapMutations: levelMapMutation} = createNamespacedHelpers('level');
    const {mapGetters: editorMapGetters, mapActions: editorMapActions, mapMutations: editorMapMutations} = createNamespacedHelpers('editor');

    export default {
        name: "LevelGrid",
        components: {
            CloseIcon,
            ContentPasteIcon,
            ContentCopyIcon,
            UndoIcon,
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
                'getGrid',
                'getBlocks'
            ]),

            ...editorMapGetters([
                'getLevelGridSelectedRegion',
                'getBlockBrowserSelected',
                'getLevelGridTopMostUndo',
                'getLevelName'
            ]),

            getCellSize: function () {
                return this.gridRenderer.cellWidth;
            },

            isRegionSelected: function() {
                return this.getLevelGridSelectedRegion.x1 >= 0
            }
        },

        data: function () {
            return {
                gridRenderer: new GridRenderer(),
                containerWidth: 0,
                modifications: new MarkerRegistry(),
                selecting: false,
                selectedFloor: 0,
                selectedTool: 0,
                clipboard: null,
                select: {
                    x: -1,
                    y: -1
                }
            };
        },

        watch: {
            getGrid: function (value) {
                this.redraw();
            }
        },

        methods: {
            ...levelMapActions({
                setGridSize: LEVEL_ACTION.SET_GRID_SIZE,
                saveLevel: LEVEL_ACTION.SAVE_LEVEL,
                setGridCell: LEVEL_ACTION.SET_GRID_CELL,
                setGridCells: LEVEL_ACTION.SET_GRID_CELLS,
            }),


            ...editorMapActions({
                setStatusBarText: EDITOR_ACTION.SET_STATUSBAR_TEXT,
                selectRegion: EDITOR_ACTION.SELECT_REGION,
                popUndo: EDITOR_ACTION.POP_UNDO
            }),

            ...levelMapMutation({
                defineBlock: LEVEL_MUTATION.DEFINE_BLOCK
            }),


            ...editorMapMutations({
                selectBlock: EDITOR_MUTATION.BLOCKBROWSER_SET_SELECTED,
                pushUndo: EDITOR_MUTATION.PUSH_UNDO
            }),

            selectTool: function ({index}) {
                this.selectedTool = index;
                switch (index) {
                    case 0:
                        // déselect texture
                        this.selectBlock({value: null});
                        break;
                }
            },

            selectFloor: function ({index}) {
                this.selectedFloor = index;
                this.redraw();
            },

            invalidateRect: function (x1, y1, x2, y2) {
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
                        if (x >= 0 && y >= 0 && x < this.getGridSize && y < this.getGridSize) {
                            this.modifications.mark(x, y);
                        }
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
            paintEvent: async function ({x, y, canvas, cell}) {
                const ctx = canvas.getContext('2d');
                const w = canvas.width;
                const h = canvas.height;

                const sMask = (this.selectedFloor == 1 ? 'T' : '') +
                    (!!cell.upperblock ? 'U' : '') +
                    (!!cell.block ? 'L' : '');

                let oLowerCvs = null;
                let oUpperCvs = null;

                if (!!cell.block) {
                    oLowerCvs = BlockCache.load(cell.block);
                }

                if (!!cell.upperblock) {
                    oUpperCvs = BlockCache.load(cell.upperblock);
                }


                switch (sMask) {
                    case '':
                    case 'T':
                        // Aucun block n'a été défini : on ne doit rien dessiner
                        break;

                    case 'L':
                        // Block inférieur présent, block supérieur absent
                        // on agit actuellement sur l'étage inférieur
                        // on doit dessiner le block inférieur sur toute la surface, en opacité 1
                        if (!!oLowerCvs) {
                            ctx.drawImage(
                                oLowerCvs,
                                0,
                                0,
                                oLowerCvs.width,
                                oLowerCvs.height,
                                0,
                                0,
                                canvas.width,
                                canvas.height
                            );
                        }
                        break;

                    case 'TL':
                        // Block inférieur présent, block supérieur absent
                        // on agit actuellement sur l'étage supérieur
                        // on doit dessiner le block inférieur sur toute la surface, en opacité 0.5
                        if (!!oLowerCvs) {
                            const f = ctx.globalAlpha;
                            ctx.globalAlpha = 0.5;
                            ctx.drawImage(
                                oLowerCvs,
                                0,
                                0,
                                oLowerCvs.width,
                                oLowerCvs.height,
                                0,
                                0,
                                canvas.width,
                                canvas.height
                            );
                            ctx.globalAlpha = f;
                        }
                        break;

                    case 'U':
                        // Block inférieur absent, block supérieur présent
                        // on agit actuellement sur l'étage inférieur
                        // on doit dessiner le upper block sur la moitié haute, en opacité 0.5
                        if (!!oUpperCvs) {
                            const f = ctx.globalAlpha;
                            ctx.globalAlpha = 0.5;
                            ctx.drawImage(
                                oUpperCvs,
                                0,
                                0,
                                oUpperCvs.width,
                                oUpperCvs.height,
                                0,
                                0,
                                canvas.width,
                                canvas.height >> 1
                            );
                            ctx.globalAlpha = f;
                        }
                        break;

                    case 'TU':
                        // Block inférieur absent, block supérieur présent
                        // on agit actuellement sur l'étage supérieur
                        // on doit dessiner le upper block sur la moitié haute, en opacité 1
                        if (!!oUpperCvs) {
                            ctx.drawImage(
                                oUpperCvs,
                                0,
                                0,
                                oUpperCvs.width,
                                oUpperCvs.height,
                                0,
                                0,
                                canvas.width,
                                canvas.height >> 1
                            );
                        }
                        break;

                    case 'UL':
                        // Blocks inférieur et supérieur présents
                        // on doit dessiner les deux blocks,
                        // seul le block inférieur est à opacité 1, l'autre est à opacité 0.5
                        if (!!oUpperCvs) {
                            const f = ctx.globalAlpha;
                            ctx.globalAlpha = 0.5;
                            if (!!oUpperCvs) {
                                ctx.drawImage(
                                    oUpperCvs,
                                    0,
                                    0,
                                    oUpperCvs.width,
                                    oUpperCvs.height,
                                    0,
                                    0,
                                    canvas.width,
                                    canvas.height >> 1
                                );
                            }
                            ctx.globalAlpha = f;
                        }
                        if (!!oLowerCvs) {
                            ctx.drawImage(
                                oLowerCvs,
                                0,
                                0,
                                oLowerCvs.width,
                                oLowerCvs.height,
                                0,
                                canvas.height >> 1,
                                canvas.width,
                                canvas.height >> 1
                            );
                        }
                        break;

                    case 'TUL':
                        // Blocks inférieur et supérieur présents
                        // on doit dessiner les deux blocks,
                        // seul le block supérieur est à opacité 1, l'autre est à opacité 0.5
                        if (!!oUpperCvs) {
                            if (!!oUpperCvs) {
                                ctx.drawImage(
                                    oUpperCvs,
                                    0,
                                    0,
                                    oUpperCvs.width,
                                    oUpperCvs.height,
                                    0,
                                    0,
                                    canvas.width,
                                    canvas.height >> 1
                                );
                            }
                        }
                        if (!!oLowerCvs) {
                            const f = ctx.globalAlpha;
                            ctx.globalAlpha = 0.5;
                            ctx.drawImage(
                                oLowerCvs,
                                0,
                                0,
                                oLowerCvs.width,
                                oLowerCvs.height,
                                0,
                                canvas.height >> 1,
                                canvas.width,
                                canvas.height >> 1
                            );
                            ctx.globalAlpha = f;
                        }
                        break;
                }

                // peinture selection
                const {x1, y1, x2, y2} = this.getLevelGridSelectedRegion;
                const bSelected = x >= x1 && x <= x2 && y >= y1 && y <= y2;
                if (bSelected) {
                    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
                    ctx.fillRect(0, 0, w, h);
                }
            },

            redraw: function () {
                const a = this.modifications.toArray();
                this.modifications.clear();
                this.$nextTick(() => {
                    this.gridRenderer.render(this.$refs.levelgrid, this.getGrid, a.length > 0 ? a : undefined);
                });
            },


            undo: async function() {
                const aUndoStruct = this.getLevelGridTopMostUndo;
                for (let i = 0, l = aUndoStruct.length; i < l; ++i) {
                    const u = aUndoStruct[i];
                    await this.setGridCell({
                        x: u.x,
                        y: u.y,
                        floor: 0,
                        block: u.block
                    });
                    await this.setGridCell({
                        x: u.x,
                        y: u.y,
                        floor: 1,
                        block: u.upperblock
                    });
                }
                await this.popUndo();
                this.$nextTick(() => this.redraw());
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
                if (this.selectedTool === 1 && !!this.getBlockBrowserSelected) {
                    const oPrevRegion = this.getLevelGridSelectedRegion;
                    this.invalidateRect(oPrevRegion.x1, oPrevRegion.y1, oPrevRegion.x2, oPrevRegion.y2);
                    const aUndoStruct = [];
                    const aList = [];
                    this.modifications.iterate((cx, cy) => {
                        aList.push({x: cx, y: cy});
                        aUndoStruct.push(this.getCellStruct(cx, cy));
                    });
                    this.pushUndo({undo: aUndoStruct});
                    this.setGridCells({xy: aList, floor: this.selectedFloor, block: this.getBlockBrowserSelected});
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
             * Save the level
             */
            saveClick: function () {
                const sFileName = prompt('Enter a filename', this.getLevelName);
                if (!!sFileName) {
                    this.saveLevel({name: sFileName});
                    this.setStatusBarText({text: 'Level saved : ' + sFileName});
                } else {
                    this.setStatusBarText({text: 'Level NOT saved'});
                }
            },

            loadClick: function () {
                this.$router.push('/list-levels');
            },

            /**
             * Grid shrinks : loses one row and one column
             */
            smallerGridClick: function () {
                this.setGridSize({value: Math.max(1, this.getGridSize - 1)});
            },

            /**
             * Grid grows : gain one row and one column
             */
            largerGridClick: function () {
                this.setGridSize({value: Math.min(256, this.getGridSize + 1)});
            },

            /**
             * zoom the grid out : each cell becomes smaller, you can see a larger level area
             */
            zoomOutClick: function () {
                this.gridRenderer.zoomOut();
                this.redraw();
            },

            /**
             * zoom the grid in : each cell becomes smaller, and you can see each cell more precisely
             */
            zoomInClick: function () {
                this.gridRenderer.zoomIn();
                this.redraw();
            },

            getCellStruct: function(x, y) {
                const cell = this.getGrid[y][x];
                return {
                    x,
                    y,
                    block: cell.block,
                    upperblock: cell.upperblock
                };
            },

            iterateSelection: function(f) {
                const sr = this.getLevelGridSelectedRegion;
                for (let y = sr.y1; y <= sr.y2; ++y) {
                    for (let x = sr.x1; x <= sr.x2; ++x) {
                        f(x, y);
                    }
                }
            },

            copyClick: function() {
                const sr = this.getLevelGridSelectedRegion;
                const cells = [];
                const clipboard = {
                    width: sr.x2 - sr.x1 + 1,
                    height: sr.y2 - sr.y1 + 1
                };
                this.iterateSelection((x, y) => cells.push(this.getCellStruct(x, y)));
                clipboard.cells = cells;
                this.clipboard = clipboard;
            },

            pasteClick: async function() {
                const sr = this.getLevelGridSelectedRegion;
                const xs = sr.x1;
                const ys = sr.y1;
                const clipboard = this.clipboard;
                let i = 0;
                const aUndo = [];
                for (let y = 0; y < clipboard.height; ++y) {
                    const yi = y + ys;
                    if (yi < 0 || yi >= this.getGridSize) {
                        continue;
                    }
                    for (let x = 0; x < clipboard.width; ++x) {
                        const xi = x + xs;
                        if (xi < 0 || xi >= this.getGridSize) {
                            continue;
                        }
                        aUndo.push(this.getCellStruct(xi, yi));
                        this.invalidateRect(xi, yi, xi + clipboard.width - 1, yi + clipboard.height - 1);
                        await this.setGridCell({
                            x: xi,
                            y: yi,
                            floor: 0,
                            block: clipboard.cells[i].block
                        });
                        await this.setGridCell({
                            x: xi,
                            y: yi,
                            floor: 1,
                            block: clipboard.cells[i].upperblock
                        });
                        ++i;
                    }
                }
                await this.pushUndo({undo: aUndo});
                this.$nextTick(() => this.redraw());
            },

            clearClick: async function() {
                const xy = [];
                const aUndo = [];
                this.iterateSelection((x, y) => {
                    aUndo.push(this.getCellStruct(x, y));
                    this.invalidateRect(x, y, x, y);
                    xy.push({x, y})
                });
                await this.setGridCells({
                    xy, floor: this.selectedFloor, block: null
                });
                await this.pushUndo({undo: aUndo});
                this.$nextTick(() => this.redraw());
            },

            keydownEvent: function(event) {
                switch (event.key) {
                    case 'F5':
                        return;
                }
                event.preventDefault();
                event.stopPropagation();

                console.log(event.ctrlKey);
                const key = (event.ctrlKey ? 'ctrl-' : '') + event.key;

                switch (key) {
                    case 'ctrl-c':
                        this.copyClick();
                        break;

                    case 'ctrl-v':
                        this.pasteClick();
                        break;

                    case 'ctrl-z':
                        this.undo();
                        break;

                    case 'ctrl-o':
                        this.loadClick();
                        break;

                    case 'ctrl-s':
                        this.saveClick();
                        break;
                }
            }
        },

        mounted: function () {
            this.gridRenderer.events.on('paint', this.paintEvent);
            this.$nextTick(function () {
                window.addEventListener('resize', this.resizeEvent);
                document.addEventListener('keydown', this.keydownEvent);
                this.resizeEvent();
                this.redraw();
            });

        },

        beforeDestroy: function () {
            window.removeEventListener('resize', this.resizeEvent);
            document.removeEventListener('keydown', this.keydownEvent);
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