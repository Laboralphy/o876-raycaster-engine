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
                <label>Tag : <input style="width: 10em" type="text"/></label><MyButton><PlusIcon></PlusIcon></MyButton>
        </div>
    </Window>
</template>

<script>
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
            }
        },

        computed: {
            ...editorMapGetters([
                'getHighLightedTags',
                'getLevelGridSelectedRegion'
            ])
        },

        methods: {
            deleteTagClick: function(t) {

            }
        }
    }
</script>

<style scoped>
</style>