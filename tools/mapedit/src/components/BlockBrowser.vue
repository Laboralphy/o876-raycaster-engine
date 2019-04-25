<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Block browser"
    >
        <template v-slot:toolbar>
            <MyButton title="Delete the selected blocks"><DeleteIcon title="Delete the selected blocks" decorative></DeleteIcon></MyButton>
        </template>
        <Block
                v-for="b in getBlocks"
                :key="b.id"
                width="128"
                height="128"
                :content="b.preview"
        ></Block>
    </Window>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex';
    import Block from "./Block.vue";
    import Window from "./Window.vue";
    import DeleteIcon from "vue-material-design-icons/Delete.vue";
    import MyButton from "./MyButton.vue";


    const {mapGetters: levelMapGetters} = createNamespacedHelpers('level');

    export default {
        name: "BlockBrowser",
        components: {MyButton, DeleteIcon, Block, Window},

        computed: {
            ...levelMapGetters([
                'getBlocks'
            ])
        }
    }
</script>

<style scoped>

</style>