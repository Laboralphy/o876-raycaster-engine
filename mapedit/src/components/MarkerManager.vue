<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Marker Manager"
    >
        <template v-slot:toolbar>
        </template>
        <h3>Available shapes</h3>
        <p>Select a cell, or a region of cells, on the level map, then click on one of the buttons below, to apply a mark.</p>
        <div>
            <MyButton @click="() => setShape(CONSTS.SHAPE_NONE)"><CloseCircleIcon style="color: #A00"></CloseCircleIcon></MyButton>
            <MyButton @click="() => setShape(CONSTS.SHAPE_CIRCLE)"><CircleIcon></CircleIcon></MyButton>
            <MyButton @click="() => setShape(CONSTS.SHAPE_SQUARE)"><SquareIcon></SquareIcon></MyButton>
            <MyButton @click="() => setShape(CONSTS.SHAPE_TRIANGLE)"><TriangleIcon></TriangleIcon></MyButton>
            <MyButton @click="() => setShape(CONSTS.SHAPE_RHOMBUS)"><RhombusIcon></RhombusIcon></MyButton>
            <MyButton @click="() => setShape(CONSTS.SHAPE_HEXAGON)"><HexagonIcon></HexagonIcon></MyButton>
        </div>
        <hr />
        <h3>Available colors</h3>
        <p>Mark a cell, or a region of <u>MARKED</u> cells <i>(see above)</i>, then click on one of the button below to change its color.</p>
        <div>
            <MyButton @click="() => setColor('black')"><SquareIcon style="color: black"></SquareIcon></MyButton>
            <MyButton @click="() => setColor('red')"><SquareIcon style="color: red"></SquareIcon></MyButton>
            <MyButton @click="() => setColor('lime')"><SquareIcon style="color: lime"></SquareIcon></MyButton>
            <MyButton @click="() => setColor('yellow')"><SquareIcon style="color: yellow"></SquareIcon></MyButton>
            <MyButton @click="() => setColor('blue')"><SquareIcon style="color: blue"></SquareIcon></MyButton>
            <MyButton @click="() => setColor('magenta')"><SquareIcon style="color: magenta"></SquareIcon></MyButton>
            <MyButton @click="() => setColor('cyan')"><SquareIcon style="color: cyan"></SquareIcon></MyButton>
            <MyButton @click="() => setColor('white')"><SquareIcon style="color: white"></SquareIcon></MyButton>
        </div>
        <hr />
        <h3>Startpoint</h3>
        <p>Select a single cell on the map, then click on one of the directionnal button below, to define the starting point.</p>
        <div>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <MyButton @click="() => placeStartPoint(1.25)"><ArrowTopLeftThickIcon decorative></ArrowTopLeftThickIcon></MyButton>
                        </td>
                        <td>
                            <MyButton @click="() => placeStartPoint(1.5)"><ArrowUpThickIcon decorative></ArrowUpThickIcon></MyButton>
                        </td>
                        <td>
                            <MyButton @click="() => placeStartPoint(1.75)"><ArrowTopRightThickIcon decorative></ArrowTopRightThickIcon></MyButton>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <MyButton @click="() => placeStartPoint(1)"><ArrowLeftThickIcon decorative></ArrowLeftThickIcon></MyButton>
                        </td>
                        <td>

                        </td>
                        <td>
                            <MyButton @click="() => placeStartPoint(0)"><ArrowRightThickIcon decorative></ArrowRightThickIcon></MyButton>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <MyButton @click="() => placeStartPoint(0.75)"><ArrowBottomLeftThickIcon decorative></ArrowBottomLeftThickIcon></MyButton>
                        </td>
                        <td>
                            <MyButton @click="() => placeStartPoint(0.5)"><ArrowDownThickIcon decorative></ArrowDownThickIcon></MyButton>
                        </td>
                        <td>
                            <MyButton @click="() => placeStartPoint(0.25)"><ArrowBottomRightThickIcon decorative></ArrowBottomRightThickIcon></MyButton>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    </Window>
</template>

<script>
    import * as LEVEL_ACTIONS from '../store/modules/level/action-types';
    import * as EDITOR_MUTATIONS from '../store/modules/editor/mutation-types';
    import * as CONSTS from '../consts';
    import {createNamespacedHelpers} from 'vuex';

    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import SquareIcon from "vue-material-design-icons/Square.vue";
    import RhombusIcon from "vue-material-design-icons/Rhombus.vue";
    import CircleIcon from "vue-material-design-icons/Circle.vue";
    import HexagonIcon from "vue-material-design-icons/Hexagon.vue";
    import TriangleIcon from "vue-material-design-icons/Triangle.vue";
    import CloseCircleIcon from "vue-material-design-icons/CloseCircle.vue";

    import ArrowTopLeftThickIcon from "vue-material-design-icons/ArrowTopLeftThick.vue";
    import ArrowUpThickIcon from "vue-material-design-icons/ArrowUpThick.vue";
    import ArrowTopRightThickIcon from "vue-material-design-icons/ArrowTopRightThick.vue";
    import ArrowLeftThickIcon from "vue-material-design-icons/ArrowLeftThick.vue";
    import ArrowRightThickIcon from "vue-material-design-icons/ArrowRightThick.vue";
    import ArrowBottomLeftThickIcon from "vue-material-design-icons/ArrowBottomLeftThick.vue";
    import ArrowDownThickIcon from "vue-material-design-icons/ArrowDownThick.vue";
    import ArrowBottomRightThickIcon from "vue-material-design-icons/ArrowBottomRightThick.vue";

    const {mapGetters: levelGetters, mapActions: levelActions} = createNamespacedHelpers('level');
    const {mapGetters: editorGetters, mapMutations: editorMutations} = createNamespacedHelpers('editor');



    export default {
        name: "MarkerManager",
        components: {
            ArrowBottomRightThickIcon,
            ArrowDownThickIcon,
            ArrowBottomLeftThickIcon,
            ArrowRightThickIcon,
            ArrowLeftThickIcon,
            ArrowTopRightThickIcon,
            ArrowUpThickIcon,
            ArrowTopLeftThickIcon,

            CloseCircleIcon,
            MyButton,
            TriangleIcon, HexagonIcon, CircleIcon, RhombusIcon, SquareIcon, Window},

        data: function() {
            return {
                CONSTS
            }
        },

        computed: {
            ...editorGetters([
                'getLevelGridSelectedRegion',
                'isLevelGridRegionSelected'
            ]),

            ...levelGetters([
                'getStartpoint'
            ])
        },

        methods: {
            ...levelActions({
                setCellMark: LEVEL_ACTIONS.SET_CELL_MARK,
                setStartpoint: LEVEL_ACTIONS.SET_STARTING_POINT
            }),

            ...editorMutations({
                somethingHasChanged: EDITOR_MUTATIONS.SOMETHING_HAS_CHANGED
            }),

            setShape: async function(nShape) {
                if (this.isLevelGridRegionSelected) {
                    const sr = this.getLevelGridSelectedRegion;
                    const proms = [];
                    for (let y = sr.y1; y <= sr.y2; ++y) {
                        for (let x = sr.x1; x <= sr.x2; ++x) {
                            proms.push(this.setCellMark({x, y, shape: nShape, color: null}));
                        }
                    }
                    await Promise.all(proms);
                    this.somethingHasChanged({value: true});
                }
            },

            placeStartPoint: async function(angle) {
                if (this.isLevelGridRegionSelected) {
                    const sr = this.getLevelGridSelectedRegion;
                    const x = sr.x1;
                    const y = sr.y1;
                    this.setStartpoint({x, y, angle});
                    this.somethingHasChanged({value: true});
                }
            },

            setColor: async function(nColor) {
                if (this.isLevelGridRegionSelected) {
                    const sr = this.getLevelGridSelectedRegion;
                    const proms = [];
                    for (let y = sr.y1; y <= sr.y2; ++y) {
                        for (let x = sr.x1; x <= sr.x2; ++x) {
                            proms.push(this.setCellMark({x, y, shape: null, color: nColor}));
                        }
                    }
                    await Promise.all(proms);
                    this.somethingHasChanged({value: true});
                }
            }
        }
    }
</script>

<style scoped>

</style>