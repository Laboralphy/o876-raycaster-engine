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

    const {mapActions: levelMapActions} = createNamespacedHelpers('level');
    const {mapGetters: editorMapGetters, mapMutations: editorMapMutations} = createNamespacedHelpers('editor');



    export default {
        name: "MarkerManager",
        components: {
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