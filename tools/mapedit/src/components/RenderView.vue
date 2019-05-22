<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Raycaster rendering"
    >
        <template v-slot:toolbar>
        </template>
        <div>

        </div>
    </Window>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex';
    import Window from "./Window.vue";
    import {generate} from '../libraries/generate';

    const {mapGetters: levelMapGetters} = createNamespacedHelpers('level');
    export default {
        name: "RenderView",
        components: {Window},

        computed: {
            ...levelMapGetters(['getLevel'])
        },

        mounted: async function() {
            const level = this.getLevel;
            // template du json à générer
            const data = await generate(level);
            console.log(data);

        }
    }
</script>

<style scoped>
</style>