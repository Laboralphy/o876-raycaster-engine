<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Animation builder"
    >
        <template v-slot:toolbar>
            <HomeButton></HomeButton>
        </template>
        <form>
            <h3>Drag and drop eithesr <b>one</b> wall or <b>one</b> flat texture</h3>
<!--            <Tile-->
<!--                    type="w"-->
<!--                    :tile="1"-->
<!--            ></Tile>-->
<!--            <Tile-->
<!--                    type="w"-->
<!--                    :tile="1"-->
<!--            ></Tile>-->
            <div>
                <label>Frames: <input type="number" min="2"></label>
            </div>
            <div>
                <label>Duration (ms): <input type="number" min="0"></label>
            </div>
            <div>
                <label>
                    Loop:
                    <select>
                        <option v-for="p in getBlockBuilderAnimLoopData" :key="p.id" :value="p.id">{{ p.label }}</option>
                    </select>
                </label>
            </div>
        </form>
    </Window>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex';
    import Window from "./Window.vue";
    import HomeButton from "./HomeButton.vue";
    //import Tile from "./Tile.vue";


    const {mapGetters: editorMapGetters} = createNamespacedHelpers('editor');

    export default {
        name: "AnimationBuilder",
        components: {HomeButton, Window},

        props: {
            tile: {     // index de la premier tile
                type: Number,
                required: true
            }
        },

        computed: {
            ...editorMapGetters([
                'getBlockBuilderAnimLoopData'
            ])
        }
    }
</script>

<style scoped>

</style>