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
    import * as ACTION from '../store/modules/level/action-types';
    import * as MUTATION from '../store/modules/editor/mutation-types';
    import {createNamespacedHelpers} from 'vuex';
    import * as CONSTS from '../consts';
    import Block from "./Block.vue";
    import Window from "./Window.vue";
    import DeleteIcon from "vue-material-design-icons/Delete.vue";
    import MyButton from "./MyButton.vue";
    import PencilIcon from "vue-material-design-icons/Pencil.vue";
    import PlusIcon from "vue-material-design-icons/Plus.vue";


    const {mapGetters: levelMapGetters, mapActions: levelMapActions} = createNamespacedHelpers('level');
    const {mapGetters: editorMapGetters, mapMutations: editorMapMutations} = createNamespacedHelpers('editor');

    export default {
        name: "BlockBrowser",
        components: {PlusIcon, PencilIcon, MyButton, DeleteIcon, Block, Window},

        data: function() {
            return {
                CONSTS
            }
        },

        computed: {
            ...levelMapGetters([
                'getBlocks'
            ]),
            ...editorMapGetters([
                'getBlockBrowserSelected'
            ])
        },

        methods: {
            ...levelMapActions({
                deleteBlock: ACTION.DELETE_BLOCK
            }),

            ...editorMapMutations([
                MUTATION.BLOCKBROWSER_SET_SELECTED
            ]),


            onClicked: function(id) {
                if (this.getBlockBrowserSelected === id) {
                    this[MUTATION.BLOCKBROWSER_SET_SELECTED]({value: null});
                } else {
                    this[MUTATION.BLOCKBROWSER_SET_SELECTED]({value: id});
                }
            },

            createClicked() {
                this.$router.push('/build-block/0');
            },

            deleteClicked() {
                if (confirm('Delete this block ?')) {
                    this.deleteBlock({id: this.selected});
                    this.selected = null;
                    this[MUTATION.BLOCKBROWSER_SET_SELECTED]({value: null});
                }
            },


            modifyClicked() {
                this.$router.push('/build-block/' + this.selected);
            }
        }
    }
</script>

<style scoped>
</style>