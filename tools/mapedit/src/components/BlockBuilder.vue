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
                            <FormBlockProps ref="blockProps" @submit="onFormSubmit"></FormBlockProps>
                        </td>
                        <td class="tiles">
                            <table class="block-def">
                                <tbody>
                                    <tr>
                                        <td colspan="4">
                                            <DropZoneCanvas
                                                    ref="tc"
                                                    @change="id => tileUpdate('c', id)"
                                                    :tile="getBlockBuilderFaceCeiling"
                                                    label="ceiling"
                                                    class="tile ceiling"
                                                    :width="getTileWidth"
                                                    :height="getTileWidth"
                                            ></DropZoneCanvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <DropZoneCanvas
                                                    ref="tw"
                                                    @change="id => tileUpdate('w', id)"
                                                    :tile="getBlockBuilderFaceWest"
                                                    label="west"
                                                    class="tile wall0"
                                                    :width="getTileWidth"
                                                    :height="getTileHeight"
                                            ></DropZoneCanvas>
                                        </td>
                                        <td>
                                            <DropZoneCanvas
                                                    ref="tn"
                                                    @change="id => tileUpdate('n', id)"
                                                    :tile="getBlockBuilderFaceNorth"
                                                    label="north"
                                                    class="tile wall1"
                                                    :width="getTileWidth"
                                                    :height="getTileHeight"
                                            ></DropZoneCanvas>
                                        </td>
                                        <td>
                                            <DropZoneCanvas
                                                    ref="ts"
                                                    @change="id => tileUpdate('s', id)"
                                                    :tile="getBlockBuilderFaceSouth"
                                                    label="south"
                                                    class="tile wall2"
                                                    :width="getTileWidth"
                                                    :height="getTileHeight"
                                            ></DropZoneCanvas>
                                        </td>
                                        <td>
                                            <DropZoneCanvas
                                                    ref="te"
                                                    @change="id => tileUpdate('e', id)"
                                                    :tile="getBlockBuilderFaceEast"
                                                    label="east"
                                                    class="tile wall3"
                                                    :width="getTileWidth"
                                                    :height="getTileHeight"
                                            ></DropZoneCanvas>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="4">
                                            <DropZoneCanvas
                                                    ref="tf"
                                                    @change="id => tileUpdate('f', id)"
                                                    :tile="getBlockBuilderFaceFloor"
                                                    label="floor"
                                                    class="tile floor"
                                                    :width="getTileWidth"
                                                    :height="getTileWidth"
                                            ></DropZoneCanvas>
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
    import * as MUTATION from '../store/modules/editor/mutation-types';
    // vuex
    import {createNamespacedHelpers} from'vuex';

    import Window from "./Window.vue";
    import HomeButton from "./HomeButton.vue";
    import MyButton from "./MyButton.vue";
    import FormBlockProps from "./FormBlockProps.vue";
    import DropZoneCanvas from "./DropZoneCanvas.vue";

    const {mapGetters: levelMapGetter, mapActions: levelMapActions} = createNamespacedHelpers('level');
    const {mapGetters: editorMapGetter, mapMutations: editorMapMutations} = createNamespacedHelpers('editor');

    export default {
        name: "BlockBuilder",
        components: {DropZoneCanvas, FormBlockProps, MyButton, HomeButton, Window},

        data: function() {
            return {
            }
        },

        computed: {
            ...levelMapGetter([
                'getTileHeight',
                'getTileWidth'
            ]),

            ...editorMapGetter([
                'getBlockBuilderFaceNorth',
                'getBlockBuilderFaceEast',
                'getBlockBuilderFaceWest',
                'getBlockBuilderFaceSouth',
                'getBlockBuilderFaceFloor',
                'getBlockBuilderFaceCeiling'
            ])
        },

        methods: {
            ...editorMapMutations([
                MUTATION.BLOCKBUILDER_SET_FACE
            ]),

            onFormSubmit: function(data) {
            },

            tileUpdate(face, value) {
                this[MUTATION.BLOCKBUILDER_SET_FACE]({face, value});
            }
        }
    }
</script>

<style scoped>
    .form input[type="number"] {
        width: 4em;
    }

    td.tiles table.block-def td {
        text-align: center;
    }
</style>