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
                        title="Select tool"
                        :default="true"
                        :disabled="!isSelectToolAvailable"
                >
                    <SelectIcon
                            title="Select tool"
                            decorative
                    ></SelectIcon>
                </SiblingButton>

                <SiblingButton
                        title="Draw tool"
                        :disabled="!isDrawToolAvailable"
                >
                    <PencilIcon
                            title="Draw tool"
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
                    :disabled="!isLevelGridRegionSelected"
            >
                <ContentCopyIcon
                        title="Copy"
                        decorative>
                </ContentCopyIcon>
            </MyButton>

            <MyButton
                    title="Paste"
                    @click="pasteClick"
                    :disabled="clipboard === null && !isLevelGridRegionSelected"
            >
                <ContentPasteIcon
                        title="Paste"
                        decorative>
                </ContentPasteIcon>
            </MyButton>

            <MyButton
                    title="Clear"
                    @click="clearClick"
                    :disabled="!isLevelGridRegionSelected"
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
    import * as FH from '../libraries/fetch-helper';
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
    import MarkerRegistry from "../../../../lib/src/marker-registry";
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

    import SillyCanvasFactory from "../libraries/silly-canvas-factory";

    const {mapGetters: levelMapGetters, mapActions: levelMapActions, mapMutations: levelMapMutation} = createNamespacedHelpers('level');
    const {mapGetters: editorMapGetters, mapActions: editorMapActions, mapMutations: editorMapMutations} = createNamespacedHelpers('editor');

    const SCF = new SillyCanvasFactory();


    const OBJECT_TYPE_BLOCK = 'OBJECT_TYPE_BLOCK';
    const OBJECT_TYPE_TAG = 'OBJECT_TYPE_TAG';
    const OBJECT_TYPE_MARK = 'OBJECT_TYPE_MARK';
    const OBJECT_TYPE_THING = 'OBJECT_TYPE_THING';

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
                'getBlocks',
                'getStartpoint',
                'getLevel'
            ]),

            ...editorMapGetters([
                'getLevelGridSelectedRegion',
                'isLevelGridRegionSelected',
                'getBlockBrowserSelected',
                'getThingBrowserSelected',
                'getLevelGridTopMostUndo',
                'getLevelName',
                'getSomethingHasChanged',
                'getLevelGridThingSelected'
            ]),

            getCellSize: function () {
                return this.gridRenderer.cellWidth;
            },

            /**
             * Renvoie le type d'objet qu'il est possible d'éditer actuellement
             */
            getSelectedObjectType: function() {
                switch (this.currentRoute) {
                    case '/level/blocks':
                        return OBJECT_TYPE_BLOCK;

                    case '/level/tags':
                        return OBJECT_TYPE_TAG;

                    case '/level/marks':
                        return OBJECT_TYPE_MARK;

                    case '/level/things':
                        return OBJECT_TYPE_THING;

                    default:
                        return '';
                }
            },

            /**
             * renvoie true si l'outil de selection peut etre utilisé dans ce mode
             */
            isSelectToolAvailable: function() {
                const s = this.getSelectedObjectType;
                return s === OBJECT_TYPE_BLOCK || s === OBJECT_TYPE_MARK || s === OBJECT_TYPE_TAG;
            },

            /**
             * renvoie true si l'outil de dessin peut etre utilisé dans ce mode
             */
            isDrawToolAvailable: function() {
                const s = this.getSelectedObjectType;
                return s === OBJECT_TYPE_BLOCK || s === OBJECT_TYPE_THING;
            },
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
                currentRoute: '',
                select: {
                    x: -1,
                    y: -1
                }
            };
        },

        watch: {
            getGrid: function (value) {
                this.redraw();
            },

            getSomethingHasChanged: function(newValue, oldValue) {
                if (newValue && !oldValue) {
                    this.redraw();
                }
            },

            $route: {
                handler: function (to, from) {
                    const s = to.fullPath;
                    if (s !== this.currentRoute) {
                        this.currentRoute = s;
                    }
                    this.selectRegion({x1: -1, y1: -1, x2: -1, y2: -1});
                    this.redraw();
                },
                immediate: true
            }
        },

        methods: {
            ...levelMapActions({
                setGridSize: LEVEL_ACTION.SET_GRID_SIZE,
                setGridCell: LEVEL_ACTION.SET_GRID_CELL,
                setGridCells: LEVEL_ACTION.SET_GRID_CELLS,
                setCellProps: LEVEL_ACTION.SET_CELL_PROPS
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
                pushUndo: EDITOR_MUTATION.PUSH_UNDO,
                setHasChanged: EDITOR_MUTATION.SOMETHING_HAS_CHANGED,
                selectThing: EDITOR_MUTATION.LEVELGRID_THING_SET_SELECTED
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

                window.BC = BlockCache;
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

                // tag
                const oThingSelected = this.getLevelGridThingSelected; // thing selectionné sur la grille
                const idThingSelected = this.getThingBrowserSelected; // thing template selectionné dans le thingBrowser
                const aThings = cell.things.map(t => {
                    const bThisThingIsSelected = x === oThingSelected.xc &&
                        y === oThingSelected.yc &&
                        t.x === oThingSelected.xt &&
                        t.y === oThingSelected.yt;
                    const bThisTemplateIsSelected = t.id === idThingSelected;

                    return {
                        x: t.x,
                        y: t.y,
                        s: bThisThingIsSelected
                            ? 1
                            : bThisTemplateIsSelected
                                ? 2
                                : 0
                    };
                });

                const startpoint = this.getStartpoint;
                const misc = {};

                if (x === startpoint.x && y === startpoint.y) {
                    misc.startpoint = startpoint;
                }
                const oTagCanvas = SCF.getCanvas(cell.tags, cell.mark, aThings, misc);
                if (!!oTagCanvas) {
                    ctx.drawImage(
                        oTagCanvas,
                        0,
                        0,
                    );
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
                SCF.setSize(this.gridRenderer.cellWidth, this.gridRenderer.cellHeight);
                this.modifications.clear();
                this.$nextTick(() => {
                    this.gridRenderer.render(this.$refs.levelgrid, this.getGrid, a.length > 0 ? a : undefined);
                    this.setHasChanged({value: false});
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
                this.selecting = false;
                // déterminer si on est en mode "paint" avec un block selectionné
                if (this.selectedTool === 1) {
                    switch (this.getSelectedObjectType) {
                        case OBJECT_TYPE_BLOCK:
                            if (!!this.getBlockBrowserSelected) {
                                this.drawBlock();
                            }
                            break;

                        case OBJECT_TYPE_TAG:
                            break;

                        case OBJECT_TYPE_MARK:
                            break;

                        case OBJECT_TYPE_THING: {
                            // determiner la présence d'un thing existant
                            const oThing = this.getThingAt(x, y);
                            if (!!oThing) {
                                const {x: xc, y: yc} = this.pixelToCell(x, y);
                                this.selectThing({xc, yc, xt: oThing.x, yt: oThing.y});
                                this.$router.push('/view-thing');
                            } else if (!!this.getThingBrowserSelected) {
                                this.drawThing(x, y);
                            }
                            break;
                        }

                        default: {
                            if (this.currentRoute === '/view-thing') {
                                // on est en train de visualiser un thing, et on veut en visualiser une autre
                                const oThing = this.getThingAt(x, y);
                                if (!!oThing) {
                                    const {x: xc, y: yc} = this.pixelToCell(x, y);
                                    this.selectThing({xc, yc, xt: oThing.x, yt: oThing.y});
                                    this.$router.push('/view-thing');
                                }
                            }
                            break;
                        }
                            //throw new Error('unknown selected object type "' + this.getSelectedObjectType + '" (hint: current route is "' + this.currentRoute + '")')
                    }
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


            drawBlock: function() {
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
            },

            getThingCoords(x, y) {
                const {x: xc, y: yc} = this.pixelToCell(x, y);
                const cs = this.getCellSize;
                const xm = x % cs;
                const ym = y % cs;
                const cs3 = Math.floor(cs / 3);
                const x78 = cs3;
                const x89 = cs - cs3;
                const x3 = xm > x78
                    ? xm > x89
                        ? 2
                        : 1
                    : 0;
                const y3 = ym > x78
                    ? ym > x89
                        ? 2
                        : 1
                    : 0;
                return {xc, yc, x3, y3};
            },

            getThingAt: function(x, y) {
                const {xc, yc, x3, y3} = this.getThingCoords(x, y);
                return this.getGrid[yc][xc].things.find(t => t.x === x3 && t.y === y3);
            },

            drawThing: function(x, y) {
                const {xc, yc, x3, y3} = this.getThingCoords(x, y);

                this.setCellProps({
                    x: xc,
                    y: yc,
                    thing: {
                        x: x3,
                        y: y3,
                        id: this.getThingBrowserSelected
                    }
                });
            },


            /**
             * Save the level
             */
            saveClick: async function () {
                const sFileName = prompt('Enter a filename', this.getLevelName);
                if (!!sFileName) {
                    await FH.saveLevel(name, this.getLevel);
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
                const oActive = document.activeElement;
                const tag = oActive.tagName.toLowerCase();
                switch (tag) {
                    case 'input':
                    case 'textarea':
                    case 'select':
                        return;
                }
                switch (event.key) {
                    case 'F5':
                    case 'F11':
                    case 'F12':
                        return;
                }
                event.preventDefault();
                event.stopPropagation();

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