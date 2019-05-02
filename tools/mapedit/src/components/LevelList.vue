<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Open level"
    >
        <template v-slot:toolbar>
        </template>
        <div>
            <LevelThumbnail
                    v-for="l in getLevelList"
                    :key="l.name"
                    :name="l.name"
                    :date="l.date"
                    :preview="l.preview"
            ></LevelThumbnail>
        </div>
    </Window>

</template>

<script>
    import {createNamespacedHelpers} from 'vuex';
    import * as EDITOR_ACTION from '../store/modules/editor/action-types';
    import LevelThumbnail from "./LevelThumbnail.vue";
    import Window from "./Window.vue";

    const {mapGetters: editorMapGetters, mapActions: editorMapActions} = createNamespacedHelpers('editor');

    export default {
        name: "LevelList",
        components: {Window, LevelThumbnail},

        computed: {
            ...editorMapGetters(['getLevelList'])
        },

        methods: {

            ...editorMapActions({
                listLevel: EDITOR_ACTION.LIST_LEVELS
            }),

        },

        mounted: function() {
            this.listLevel();
        }
    }
</script>

<style scoped>

</style>