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
                            <!--

                            phys
                            offs


                            -->
                            <div>
                                <label>Phys:
                                    <select>
                                        <option value="p0">Walkable</option>
                                        <option value="p1">Solid block</option>
                                        <option value="p2">Door up</option>
                                        <option value="p3">Curtain up</option>
                                        <option value="p4">Door down</option>
                                        <option value="p5">Curtain down</option>
                                        <option value="p6">Door left</option>
                                        <option value="p7">Curtain left</option>
                                        <option value="p8">Door right</option>
                                        <option value="p9">Curtain right</option>
                                        <option value="p10">Door slide double</option>
                                        <option value="p11">Secret block</option>
                                        <option value="p12">Transparent block</option>
                                        <option value="p13">Invisible block</option>
                                        <option value="p14">Offset block</option>
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>Offs: <input type="number" min="0" :max="getTileWidth"/></label>
                            </div>
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

    import Window from "./Window.vue";
    import HomeButton from "./HomeButton.vue";

    // vuex
    import {createNamespacedHelpers} from'vuex';

    const {mapGetters: levelMapGetter, mapActions: levelMapActions} = createNamespacedHelpers('level');

    export default {
        name: "BlockBuilder",
        components: {HomeButton, Window},

        computed: {
            ...levelMapGetter([
                'getTileHeight',
                'getTileWidth'
            ])
        }
    }
</script>

<style scoped>
    canvas.tile {
        border: solid 4px black;
    }

    td.tiles table.block-def td {
        text-align: center;
    }
</style>