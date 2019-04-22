<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Block Builder"
    >
        <template v-slot:toolbar>
            <HomeButton></HomeButton>
        </template>
        <div>
            <table>
                <tbody>
                    <tr>
                        <td class="form">
                            <FormBlockProps></FormBlockProps>
                        </td>
                        <td class="tiles">
                            <table class="block-def">
                                <tbody>
                                <tr>
                                    <td colspan="4">
                                        <canvas ref="tc" class="tile ceiling" :width="getTileWidth" :height="getTileWidth"></canvas>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <canvas ref="tw0" class="tile wall0" :width="getTileWidth" :height="getTileHeight"></canvas>
                                    </td>
                                    <td>
                                        <canvas ref="tw1" class="tile wall1" :width="getTileWidth" :height="getTileHeight"></canvas>
                                    </td>
                                    <td>
                                        <canvas ref="tw2" class="tile wall2" :width="getTileWidth" :height="getTileHeight"></canvas>
                                    </td>
                                    <td>
                                        <canvas ref="tw3" class="tile wall3" :width="getTileWidth" :height="getTileHeight"></canvas>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="4">
                                        <canvas ref="tf" class="tile floor" :width="getTileWidth" :height="getTileWidth"></canvas>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Window>

</template>

<script>
    // vuex
    import {createNamespacedHelpers} from'vuex';

    import Window from "./Window.vue";
    import HomeButton from "./HomeButton.vue";
    import MyButton from "./MyButton.vue";
    import FormBlockProps from "./FormBlockProps.vue";

    const {mapGetters: levelMapGetter, mapActions: levelMapActions} = createNamespacedHelpers('level');

    export default {
        name: "BlockBuilder",
        components: {FormBlockProps, MyButton, HomeButton, Window},

        data: function() {
            return {
            }
        },

        computed: {
            ...levelMapGetter([
                'getTileHeight',
                'getTileWidth'
            ])
        }
    }
</script>

<style scoped>
    .form input[type="number"] {
        width: 4em;
    }

    canvas.tile {
        border: solid 4px black;
    }

    td.tiles table.block-def td {
        text-align: center;
    }
</style>