<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Rendering"
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

    const {mapGetters: levelMapGetters} = createNamespacedHelpers('level');
    export default {
        name: "RenderView",
        components: {Window},

        computed: {
            ...levelMapGetters(['getLevel'])
        },

        mounted: function() {
            const level = this.getLevel;
            // template du json à générer
        }
    }
</script>

<style scoped>
</style>