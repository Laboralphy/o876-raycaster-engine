<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Tag Manager"
    >
        <template v-slot:toolbar>
        </template>
        <div style="max-height: 50%">
            <h3>Tags that are already present</h3>
            <li>
                <ul v-for="t in getHighLightedTags">
                    <MyButton
                            title="Remove this tag from the selected region"
                            @click="() => deleteTagClick(t)"
                    >
                        <DeleteIcon  title="Remove this tag from the selected region" decorative></DeleteIcon>
                    </MyButton>
                    {{ t }}
                </ul>
            </li>
        </div>
        <hr>
        <div>
            <h3>Add a new tag</h3>
            <label>Tag :
                <input v-model="mTag" style="width: 10em" type="text"/>
            </label>
            <MyButton
                    @click="addClick"
            >
                <PlusIcon></PlusIcon>
            </MyButton>
        </div>
    </Window>
</template>

<script>
    import * as LEVEL_ACTION from '../store/modules/level/action-types';
    import * as EDITOR_MUTATION from '../store/modules/editor/mutation-types';
    import {createNamespacedHelpers} from 'vuex';
    import * as CONSTS from '../consts';
    import Block from "./Block.vue";
    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import PlusIcon from "vue-material-design-icons/Plus.vue";
    import DeleteIcon from "vue-material-design-icons/Delete.vue";


    const {mapGetters: levelMapGetters, mapActions: levelMapActions} = createNamespacedHelpers('level');
    const {mapGetters: editorMapGetters, mapMutations: editorMapMutations} = createNamespacedHelpers('editor');

    export default {
        name: "TagManager",
        components: {DeleteIcon, PlusIcon, MyButton, Block, Window},

        data: function() {
            return {
                CONSTS,
                mTag: ''
            }
        },

        computed: {
            ...editorMapGetters([
                'getHighLightedTags',
                'getLevelGridSelectedRegion',
                'isLevelGridRegionSelected'
            ])
        },

        methods: {

            ...levelMapActions({
                addCellTag: LEVEL_ACTION.ADD_CELL_TAG,
                removeCellTag: LEVEL_ACTION.REMOVE_CELL_TAG
            }),


            ...editorMapMutations({
                setHasChanged: EDITOR_MUTATION.SOMETHING_HAS_CHANGED,
                addHighlightedTag: EDITOR_MUTATION.ADD_HIGHLIGHTED_TAG,
                removeHighlightedTag: EDITOR_MUTATION.REMOVE_HIGHLIGHTED_TAG
            }),

            deleteTagClick: async function(t) {
                if (!this.isLevelGridRegionSelected) {
                    return;
                }
                const sr = this.getLevelGridSelectedRegion;
                const a = [];
                for (let y = sr.y1; y <= sr.y2; ++y) {
                    for (let x = sr.x1; x <= sr.x2; ++x) {
                        a.push(this.removeCellTag({x, y, value: t}));
                    }
                }
                await Promise.all(a);
                this.removeHighlightedTag({tag: t});
                this.setHasChanged({value: true});
            },

            /**
             * ajouter ce tag aux cellules selectionnée
             */
            addClick: async function() {
                if (!this.isLevelGridRegionSelected) {
                    return;
                }
                const sr = this.getLevelGridSelectedRegion;
                const a = [];
                for (let y = sr.y1; y <= sr.y2; ++y) {
                    for (let x = sr.x1; x <= sr.x2; ++x) {
                        a.push(this.addCellTag({x, y, value: this.mTag}));
                    }
                }
                await Promise.all(a);
                this.addHighlightedTag({tag: this.mTag});
                this.setHasChanged({value: true});
            }
        }
    }
</script>

<style scoped>
</style>