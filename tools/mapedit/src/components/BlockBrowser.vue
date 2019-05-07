<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Block browser"
    >
        <template v-slot:toolbar>
            <MyButton title="Create a new block" @click="onCreateClicked"><PlusIcon title="Create a new block" decorative></PlusIcon></MyButton>
            <MyButton :disabled="!selected" title="Modify the selected block" @click="onModifyClicked"><PencilIcon title="Modify the selected block" decorative></PencilIcon></MyButton>
            <MyButton :disabled="!selected" title="Delete the selected block" @click="onDeleteClicked"><DeleteIcon title="Delete the selected block" decorative></DeleteIcon></MyButton>
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

            onCreateClicked() {
                this[MUTATION.BLOCKBUILDER_SET_ID]({value: null});
                this[MUTATION.BLOCKBUILDER_SET_REF]({value: ''});
                this[MUTATION.BLOCKBUILDER_SET_PHYS]({value: 0});
                this[MUTATION.BLOCKBUILDER_SET_OFFS]({value: 0});
                this[MUTATION.BLOCKBUILDER_SET_LIGHT]({value: false});
                this[MUTATION.BLOCKBUILDER_SET_LIGHT_VALUE]({value: 0});
                this[MUTATION.BLOCKBUILDER_SET_LIGHT_INNER_RADIUS]({value: 0});
                this[MUTATION.BLOCKBUILDER_SET_LIGHT_OUTER_RADIUS]({value: 0});
                this[MUTATION.BLOCKBUILDER_SET_FACE_NORTH]({value: null});
                this[MUTATION.BLOCKBUILDER_SET_FACE_EAST]({value: null});
                this[MUTATION.BLOCKBUILDER_SET_FACE_WEST]({value: null});
                this[MUTATION.BLOCKBUILDER_SET_FACE_SOUTH]({value: null});
                this[MUTATION.BLOCKBUILDER_SET_FACE_FLOOR]({value: null});
                this[MUTATION.BLOCKBUILDER_SET_FACE_CEILING]({value: null});
                this.$router.push('/build-block');
            },

            onDeleteClicked() {
                this.deleteBlock({id: this.selected});
            },


            onModifyClicked() {
                const oBlock = this.getBlocks.find(b => b.id === this.selected);
                if (oBlock) {
                    // muter tout le bloc ?
                    const {id, ref, phys, offs, light, faces} = oBlock;
                    this[MUTATION.BLOCKBUILDER_SET_ID]({value: id});
                    this[MUTATION.BLOCKBUILDER_SET_REF]({value: ref});
                    this[MUTATION.BLOCKBUILDER_SET_PHYS]({value: phys});
                    this[MUTATION.BLOCKBUILDER_SET_OFFS]({value: offs});
                    this[MUTATION.BLOCKBUILDER_SET_LIGHT]({value: light.enabled});
                    this[MUTATION.BLOCKBUILDER_SET_LIGHT_VALUE]({value: light.value});
                    this[MUTATION.BLOCKBUILDER_SET_LIGHT_INNER_RADIUS]({value: light.inner});
                    this[MUTATION.BLOCKBUILDER_SET_LIGHT_OUTER_RADIUS]({value: light.outer});
                    this[MUTATION.BLOCKBUILDER_SET_FACE_NORTH]({value: faces.n});
                    this[MUTATION.BLOCKBUILDER_SET_FACE_EAST]({value: faces.e});
                    this[MUTATION.BLOCKBUILDER_SET_FACE_WEST]({value: faces.w});
                    this[MUTATION.BLOCKBUILDER_SET_FACE_SOUTH]({value: faces.s});
                    this[MUTATION.BLOCKBUILDER_SET_FACE_FLOOR]({value: faces.f});
                    this[MUTATION.BLOCKBUILDER_SET_FACE_CEILING]({value: faces.c});
                    this.$router.push('/build-block');
                }
            }
        }
    }
</script>

<style scoped>
</style>