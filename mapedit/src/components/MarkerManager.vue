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
        <p>Multiple starting points are supported. Select the starting point you wish to modify :</p>
        <div>
            <table>
              <tbody>
                <tr>
                  <td>
                    <DirectionalPad @select="({direction}) => directionalPadSelected(direction)"></DirectionalPad>
                  </td>
                  <td>
                    <label>#
                      <input
                          class="small-numbers"
                          v-model="currentStartPoint"
                          type="number"
                          min="0"
                          :max="getStartpointCount - 1"
                          step="1"
                      />
                    </label>
                    <p>Number of startpoints : <b>{{ getStartpointCount }}</b></p>
                    <MyButton title="Add a new startpoint" @click="createStartPoint">Create start point</MyButton>
                    <MyButton title="Remove the currently selected startpoint" @click="removeCurrentStartPoint">Remove start point</MyButton>
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

    import DirectionalPad from "./DirectionalPad.vue";

    const {mapGetters: levelGetters, mapActions: levelActions} = createNamespacedHelpers('level');
    const {mapGetters: editorGetters, mapMutations: editorMutations} = createNamespacedHelpers('editor');



    export default {
        name: "MarkerManager",
        components: {
            DirectionalPad,
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
                'getStartpoint',
                'getStartpointCount',
                'getActorStartpointId',
            ]),

            currentStartPoint: {
              get() {
                return this.getActorStartpointId
              },
              set(value) {
                this.somethingHasChanged({value: true});
                this.setCurrentStartpoint({id: value});
              }
            }
        },

        methods: {
            ...levelActions({
                setCellMark: LEVEL_ACTIONS.SET_CELL_MARK,
                setStartpoint: LEVEL_ACTIONS.SET_STARTING_POINT,
                setCurrentStartpoint: LEVEL_ACTIONS.SET_ACTOR_STARTING_POINT,
                addStartPoint: LEVEL_ACTIONS.ADD_STARTING_POINT,
                removeActorStartPoint: LEVEL_ACTIONS.REMOVE_ACTOR_STARTING_POINT
            }),

            ...editorMutations({
                somethingHasChanged: EDITOR_MUTATIONS.SOMETHING_HAS_CHANGED
            }),

            createStartPoint: function() {
              this.addStartPoint();
              this.somethingHasChanged({value: true});
            },

            removeCurrentStartPoint: function() {
              if (this.getStartpointCount > 1) {
                this.removeActorStartPoint();
                this.somethingHasChanged({value: true});
              }
            },

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
            },

            directionalPadSelected: function(direction) {
              switch (direction) {
                case 'top-left':
                  this.placeStartPoint(1.25);
                  break;

                case 'top':
                  this.placeStartPoint(1.5);
                  break;

                case 'top-right':
                  this.placeStartPoint(1.75);
                  break;

                case 'right':
                  this.placeStartPoint(0);
                  break;

                case 'bottom-right':
                  this.placeStartPoint(0.25);
                  break;

                case 'bottom':
                  this.placeStartPoint(0.5);
                  break;

                case 'bottom-left':
                  this.placeStartPoint(0.75);
                  break;

                case 'left':
                  this.placeStartPoint(1);
                  break;
              }
            }
        }
    }
</script>

<style scoped>
input.small-numbers {
  width: 6em;
}
</style>