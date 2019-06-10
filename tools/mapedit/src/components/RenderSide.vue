<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Rendering options"
    >
        <template v-slot:toolbar>
        </template>
        <div>
            <h3>Export level</h3>
            <p>Download this level as a JSON data string, so you can just use it directly with an engine instance.</p>
            <MyButton :disabled="!getDownloadURLData" :href="getDownloadURLData" :download="getDownloadFileName">Export to .json</MyButton>
            <hr/>
        </div>
    </Window>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex';

    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import {generate} from "../../../generate";

    const {mapGetters: levelMapGetters} = createNamespacedHelpers('level');
    const {mapGetters: editorMapGetters} = createNamespacedHelpers('editor');

    export default {
        name: "RenderSide",
        components: {MyButton, Window},


        data: function() {
            return {
                downloadData: ''
            };
        },

        computed: {
            ...levelMapGetters([
                'getLevel'
            ]),

            ...editorMapGetters([
                'getLevelName',
                'getLevelGeneratedData'
            ]),

            getDownloadURLData: function() {
                const data = this.getLevelGeneratedData;
                if (!!data) {
                    return "data:text/json;charset=utf-8," +
                        encodeURIComponent(
                            JSON.stringify(
                                this.getLevelGeneratedData, null, '  '
                            )
                        );
                } else {
                    return null;
                }
            },

            getDownloadFileName: function() {
                return this.getLevelName + '.json';
            }
        }
    }
</script>

<style scoped>

</style>