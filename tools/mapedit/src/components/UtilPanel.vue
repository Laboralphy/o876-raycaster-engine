<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Tools & Utilities"
    >
        <template v-slot:toolbar>
        </template>

        <div>
            <h3>Map shifting</h3>
            <p>Shifts the entire map on the grid by one cell up, left, right or down. Cells that are shift out from one side of the grid, reappear to the opposite side.</p>
            <div class="shiftpad">
                <table>
                    <tr>
                        <td></td>
                        <td>
                            <MyButton @click="doShiftGrid('n')">
                                <ArrowUpThickIcon decorative></ArrowUpThickIcon>
                            </MyButton>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>
                            <MyButton @click="doShiftGrid('w')">
                                <ArrowLeftThickIcon decorative></ArrowLeftThickIcon>
                            </MyButton>
                        </td>
                        <td></td>
                        <td>
                            <MyButton @click="doShiftGrid('e')">
                                <ArrowRightThickIcon decorative></ArrowRightThickIcon>
                            </MyButton>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <MyButton @click="doShiftGrid('s')">
                                <ArrowDownThickIcon decorative></ArrowDownThickIcon>
                            </MyButton>
                        </td>
                        <td></td>
                    </tr>
                </table>
            </div>
        </div>
    </Window>
</template>

<script>
    import * as LEVEL_ACTIONS from '../store/modules/level/action-types';
    import * as EDITOR_ACTIONS from '../store/modules/editor/action-types';
    import * as EDITOR_MUTATIONS from '../store/modules/editor/mutation-types';
    import {createNamespacedHelpers} from 'vuex';

    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import ArrowLeftThickIcon from "vue-material-design-icons/ArrowLeftThick.vue";
    import ArrowRightThickIcon from "vue-material-design-icons/ArrowRightThick.vue";
    import ArrowUpThickIcon from "vue-material-design-icons/ArrowUpThick.vue";
    import ArrowDownThickIcon from "vue-material-design-icons/ArrowDownThick.vue";


    const {mapActions: levelActions} = createNamespacedHelpers('level');
    const {mapActions: editorActions, mapMutations: editorMutations} = createNamespacedHelpers('editor');

    export default {
        name: "UtilPanel",
        components: {
            ArrowDownThickIcon,
            ArrowUpThickIcon,
            ArrowRightThickIcon,
            ArrowLeftThickIcon,
            MyButton,
            Window
        },

        methods: {
            ...levelActions({
                shiftGrid: LEVEL_ACTIONS.SHIFT_GRID,
                somethingHasChanged: EDITOR_MUTATIONS.SOMETHING_HAS_CHANGED
            }),

            doChanged: function () {
                this.somethingHasChanged({value: true});
            },

            doShiftGrid: function (direction) {
                this.shiftGrid({direction});
                this.doChanged();
            }
        }
    }
</script>

<style scoped>
    .shiftpad table {
        margin: auto;
        background-color: #AAA;
    }
</style>