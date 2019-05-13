<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Block browser"
    >
        <template v-slot:toolbar>
            <MyButton title="Create a new block" @click="createClicked"><PlusIcon title="Create a new block" decorative></PlusIcon></MyButton>
            <MyButton :disabled="!selected" title="Modify the selected block" @click="modifyClicked"><PencilIcon title="Modify the selected block" decorative></PencilIcon></MyButton>
            <MyButton :disabled="!selected" title="Delete the selected block" @click="deleteClicked"><DeleteIcon title="Delete the selected block" decorative></DeleteIcon></MyButton>
        </template>
        <Block
                v-for="b in getBlocks"
                :key="b.id"
                :width="CONSTS.BLOCK_WIDTH"
                :height="CONSTS.BLOCK_HEIGHT"
                :content="b.preview"
                :selected="b.id === selected"
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
                CONSTS,

                selected: null
            }
        },

        computed: {
            ...levelMapGetters([
                'getBlocks'
            ])
        },

        methods: {
            ...levelMapActions({
                deleteBlock: ACTION.DELETE_BLOCK
            }),

            ...editorMapMutations([
                MUTATION.BLOCKBUILDER_SET_ID,
                MUTATION.BLOCKBUILDER_SET_REF,
                MUTATION.BLOCKBUILDER_SET_PHYS,
                MUTATION.BLOCKBUILDER_SET_OFFS,
                MUTATION.BLOCKBUILDER_SET_LIGHT,
                MUTATION.BLOCKBUILDER_SET_LIGHT_VALUE,
                MUTATION.BLOCKBUILDER_SET_LIGHT_INNER_RADIUS,
                MUTATION.BLOCKBUILDER_SET_LIGHT_OUTER_RADIUS,
                MUTATION.BLOCKBUILDER_SET_FACE_NORTH,
                MUTATION.BLOCKBUILDER_SET_FACE_EAST,
                MUTATION.BLOCKBUILDER_SET_FACE_WEST,
                MUTATION.BLOCKBUILDER_SET_FACE_SOUTH,
                MUTATION.BLOCKBUILDER_SET_FACE_FLOOR,
                MUTATION.BLOCKBUILDER_SET_FACE_CEILING,

                MUTATION.BLOCKBROWSER_SET_SELECTED
            ]),


            onClicked: function(id) {
                if (this.selected === id) {
                    this.selected = null;
                    this[MUTATION.BLOCKBROWSER_SET_SELECTED]({value: null});
                } else {
                    this.selected = id;
                    this[MUTATION.BLOCKBROWSER_SET_SELECTED]({value: id});
                }
            },

            createClicked() {
                this.$router.push('/build-block/0');
            },

            deleteClicked() {
                this.deleteBlock({id: this.selected});
            },


            modifyClicked() {
                this.$router.push('/build-block/' + this.selected);
            }
        }
    }
</script>

<style scoped>
</style>