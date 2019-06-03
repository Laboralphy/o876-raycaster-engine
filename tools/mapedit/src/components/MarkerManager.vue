<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Marker Manager"
    >
        <template v-slot:toolbar>
        </template>
        <h3>Available shapes</h3>
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
        <div>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <MyButton @click="() => setStartpoint(1.25)"><ArrowTopLeftThickIcon></ArrowTopLeftThickIcon></MyButton>
                        </td>
                        <td>
                            <MyButton @click="() => setStartpoint(1.5)"><ArrowUpThickIcon></ArrowUpThickIcon></MyButton>
                        </td>
                        <td>
                            <MyButton @click="() => setStartpoint(1.75)"><ArrowTopRightThickIcon></ArrowTopRightThickIcon></MyButton>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <MyButton @click="() => setStartpoint(1)"><ArrowLeftThickIcon></ArrowLeftThickIcon></MyButton>
                        </td>
                        <td>

                        </td>
                        <td>
                            <MyButton @click="() => setStartpoint(0)"><ArrowRightThickIcon></ArrowRightThickIcon></MyButton>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <MyButton @click="() => setStartpoint(0.75)"><ArrowBottomLeftThickIcon></ArrowBottomLeftThickIcon></MyButton>
                        </td>
                        <td>
                            <MyButton @click="() => setStartpoint(0.5)"><ArrowDownThickIcon></ArrowDownThickIcon></MyButton>
                        </td>
                        <td>
                            <MyButton @click="() => setStartpoint(0.25)"><ArrowBottomRightThickIcon></ArrowBottomRightThickIcon></MyButton>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    </Window>
</template>

<script>
    import * as LEVEL_ACTION from '../store/modules/level/action-types';
    import * as EDITOR_MUTATION from '../store/modules/editor/mutation-types';
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

    const {mapGetters: levelMapGetters, mapActions: levelMapActions} = createNamespacedHelpers('level');
    const {mapGetters: editorMapGetters, mapMutations: editorMapMutations} = createNamespacedHelpers('editor');



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
            ...editorMapGetters([
                'getLevelGridSelectedRegion',
                'isLevelGridRegionSelected'
            ]),

            ...levelMapGetters([
                'getStartpoint'
            ])
        },

        methods: {
            ...levelMapActions({
                setCellMark: LEVEL_ACTION.SET_CELL_MARK
            }),

            ...editorMapMutations({
                somethingHasChanged: EDITOR_MUTATION.SOMETHING_HAS_CHANGED
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

            setStartpoint: async function(angle) {
                if (this.isLevelGridRegionSelected) {
                    const sr = this.getLevelGridSelectedRegion;
                    const x = sr.x1;
                    const y = sr.y1;
                    const sp = this.getStartpoint;
                    if (!!sp) {
                        // virer l'ancien startpoint
                        await this.setCellMark({x: sp.x, y: sp.y, shape: CONSTS.SHAPE_NONE, color: 0});
                    }
                    await this.setCellMark({x, y, shape: CONSTS.SHAPE_STARTPOINT, color: angle.toString()});
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