<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Block browser"
    >
        <template v-slot:toolbar>
            <MyButton title="Create a new block" @click="createClicked"><PlusIcon title="Create a new block" decorative></PlusIcon></MyButton>
            <MyButton :disabled="!getBlockBrowserSelected" title="Modify the selected block" @click="modifyClicked"><PencilIcon title="Modify the selected block" decorative></PencilIcon></MyButton>
            <MyButton :disabled="!getBlockBrowserSelected" title="Delete the selected block" @click="deleteClicked"><DeleteIcon title="Delete the selected block" decorative></DeleteIcon></MyButton>
        </template>
        <Block
                v-for="b in getBlocks"
                :key="b.id"
                :width="CONSTS.BLOCK_WIDTH"
                :height="CONSTS.BLOCK_HEIGHT"
                :content="b.preview"
                :selected="b.id === getBlockBrowserSelected"
                @click="() => onClicked(b.id)"
        ></Block>
    </Window>
</template>

<script>
    import * as LEVEL_ACTIONS from '../store/modules/level/action-types';
    import * as EDITOR_ACTIONS from '../store/modules/editor/action-types';
    import * as EDITOR_MUTATIONS from '../store/modules/editor/mutation-types';
    import {createNamespacedHelpers} from 'vuex';
    import * as CONSTS from '../consts';
    import Block from "./Block.vue";
    import Window from "./Window.vue";
    import DeleteIcon from "vue-material-design-icons/Delete.vue";
    import MyButton from "./MyButton.vue";
    import PencilIcon from "vue-material-design-icons/Pencil.vue";
    import PlusIcon from "vue-material-design-icons/Plus.vue";


    const {mapGetters: levelGetters, mapActions: levelActions} = createNamespacedHelpers('level');
    const {mapGetters: editorGetters, mapActions: editorActions, mapMutations: editorMutations} = createNamespacedHelpers('editor');

    export default {
        name: "BlockBrowser",
        components: {PlusIcon, PencilIcon, MyButton, DeleteIcon, Block, Window},

        data: function() {
            return {
                CONSTS
            }
        },

        computed: {
            ...levelGetters([
                'getBlocks'
            ]),
            ...editorGetters([
                'getBlockBrowserSelected'
            ])
        },

        methods: {
            ...levelActions({
                deleteBlock: LEVEL_ACTIONS.DELETE_BLOCK
            }),

            ...editorActions({
                setSelectedTool: EDITOR_ACTIONS.SET_SELECTED_TOOL
            }),

            ...editorMutations({
                selectBlock: EDITOR_MUTATIONS.BLOCKBROWSER_SET_SELECTED,
                somethingHasChanged: EDITOR_MUTATIONS.SOMETHING_HAS_CHANGED
            }),


            onClicked: function(id) {
                if (this.getBlockBrowserSelected === id) {
                    this.selectBlock({value: null});
                } else {
                    this.selectBlock({value: id});
                    this.setSelectedTool({value: 1}); // pret à dessiner
                }
            },

            createClicked() {
                this.$router.push('/build-block/0');
            },

            deleteClicked() {
                if (confirm('Delete this block ?')) {
                    this.deleteBlock({id: this.getBlockBrowserSelected});
                    this.selectBlock({value: null});
                    this.somethingHasChanged({value: true});
                }
            },


            modifyClicked() {
                this.$router.push('/build-block/' + this.getBlockBrowserSelected);
            }
        }
    }
</script>

<style scoped>
</style>