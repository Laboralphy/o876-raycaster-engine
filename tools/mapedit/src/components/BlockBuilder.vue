<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Block Builder"
    >
        <template v-slot:toolbar>
        </template>
        <div>
            <table>
                <tbody>
                    <tr>
                        <td class="form">
                            <FormBlockProps
                                    ref="blockProps"
                                    @submitCreate="onFormSubmitCreate"
                                    @submitUpdate="onFormSubmitUpdate"
                            ></FormBlockProps>
                        </td>
                        <td class="tiles">
                            <table class="block-def">
                                <tbody>
                                    <tr>
                                        <td colspan="4">
                                            <figure>
                                                <Tile
                                                        :tile="0"
                                                        :content="getFaceCeilingContent"
                                                        :width="getTileWidth"
                                                        :height="getTileWidth"
                                                        :selectable="false"
                                                        :dropzone="true"
                                                        @drop="({incoming}) => handleDrop('c', incoming)"
                                                ></Tile>
                                                <figcaption>Ceiling
                                                    <span class="clear-button">
                                                        <CloseCircleIcon title="clear this placeholder" @click="clearTile('c')"></CloseCircleIcon>
                                                    </span></figcaption>
                                            </figure>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <figure>
                                                <Tile
                                                        :tile="0"
                                                        :content="getFaceWestContent"
                                                        :width="getTileWidth"
                                                        :height="getTileHeight"
                                                        :selectable="false"
                                                        :dropzone="true"
                                                        @drop="({incoming}) => handleDrop('w', incoming)"
                                                ></Tile>
                                                <figcaption>West
                                                    <span class="dup-button">
                                                        <ContentDuplicateIcon title="duplicate this tile to all wall panels" @click="dupTile('w')"></ContentDuplicateIcon>
                                                    </span>
                                                    <span class="clear-button">
                                                        <CloseCircleIcon title="clear this placeholder" @click="clearTile('w')"></CloseCircleIcon>
                                                    </span>
                                                </figcaption>
                                            </figure>
                                        </td>
                                        <td>
                                            <figure>
                                                <Tile
                                                        :tile="0"
                                                        :content="getFaceNorthContent"
                                                        :width="getTileWidth"
                                                        :height="getTileHeight"
                                                        :selectable="false"
                                                        :dropzone="true"
                                                        @drop="({incoming}) => handleDrop('n', incoming)"
                                                ></Tile>
                                                <figcaption>North
                                                    <span class="dup-button">
                                                        <ContentDuplicateIcon title="duplicate this tile to all wall panels" @click="dupTile('n')"></ContentDuplicateIcon>
                                                    </span>
                                                    <span class="clear-button">
                                                        <CloseCircleIcon title="clear this placeholder" @click="clearTile('n')"></CloseCircleIcon>
                                                    </span>
                                                </figcaption>
                                            </figure>
                                        </td>
                                        <td>
                                            <figure>
                                                <Tile
                                                        :tile="0"
                                                        :content="getFaceSouthContent"
                                                        :width="getTileWidth"
                                                        :height="getTileHeight"
                                                        :selectable="false"
                                                        :dropzone="true"
                                                        @drop="({incoming}) => handleDrop('s', incoming)"
                                                ></Tile>
                                                <figcaption>South
                                                    <span class="dup-button">
                                                        <ContentDuplicateIcon title="duplicate this tile to all wall panels" @click="dupTile('s')"></ContentDuplicateIcon>
                                                    </span>
                                                    <span class="clear-button">
                                                        <CloseCircleIcon title="clear this placeholder" @click="clearTile('s')"></CloseCircleIcon>
                                                    </span>
                                                </figcaption>
                                            </figure>
                                        </td>
                                        <td>
                                            <figure>
                                                <Tile
                                                        :tile="0"
                                                        :content="getFaceEastContent"
                                                        :width="getTileWidth"
                                                        :height="getTileHeight"
                                                        :selectable="false"
                                                        :dropzone="true"
                                                        @drop="({incoming}) => handleDrop('e', incoming)"
                                                ></Tile>
                                                <figcaption>East
                                                    <span class="dup-button">
                                                        <ContentDuplicateIcon title="duplicate this tile to all wall panels" @click="dupTile('e')"></ContentDuplicateIcon>
                                                    </span>
                                                    <span class="clear-button">
                                                        <CloseCircleIcon title="clear this placeholder" @click="clearTile('e')"></CloseCircleIcon>
                                                    </span>
                                                </figcaption>
                                            </figure>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="4">
                                            <figure>
                                                <Tile
                                                        :tile="0"
                                                        :content="getFaceFloorContent"
                                                        :width="getTileWidth"
                                                        :height="getTileWidth"
                                                        :selectable="false"
                                                        :dropzone="true"
                                                        @drop="({incoming}) => handleDrop('f', incoming)"
                                                ></Tile>
                                                <figcaption>Floor
                                                    <span class="clear-button">
                                                        <CloseCircleIcon title="clear this placeholder" @click="clearTile('f')"></CloseCircleIcon>
                                                    </span>
                                                </figcaption>
                                            </figure>
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
    import * as ACTION from '../store/modules/level/action-types';
    import * as MUTATION from '../store/modules/editor/mutation-types';
    // vuex
    import {createNamespacedHelpers} from'vuex';

    import Window from "./Window.vue";
    import HomeButton from "./HomeButton.vue";
    import MyButton from "./MyButton.vue";
    import FormBlockProps from "./FormBlockProps.vue";
    import Tile from "./Tile.vue";
    import CloseCircleIcon from "vue-material-design-icons/CloseCircle.vue";
    import ContentDuplicateIcon from "vue-material-design-icons/ContentDuplicate.vue";

    const {mapGetters: levelMapGetter, mapActions: levelMapActions} = createNamespacedHelpers('level');
    const {mapGetters: editorMapGetter, mapMutations: editorMapMutations} = createNamespacedHelpers('editor');

    export default {
        name: "BlockBuilder",
        components: {ContentDuplicateIcon, CloseCircleIcon, Tile, FormBlockProps, MyButton, HomeButton, Window},

        data: function() {
            return {
            }
        },

        computed: {
            ...levelMapGetter([
                'getTileHeight',
                'getTileWidth',
                'getWallTile',
                'getFlatTile',
            ]),

            ...editorMapGetter([
                'getBlockBuilderId',
                'getBlockBuilderFaceNorth',
                'getBlockBuilderFaceEast',
                'getBlockBuilderFaceWest',
                'getBlockBuilderFaceSouth',
                'getBlockBuilderFaceFloor',
                'getBlockBuilderFaceCeiling'
            ]),

            getFaceNorthContent: function() {
                const idTile = this.getBlockBuilderFaceNorth;
                const oTile = this.getWallTile(idTile);
                if (!!oTile) {
                    return oTile.content;
                } else {
                    return '';
                }
            },

            getFaceWestContent: function() {
                const idTile = this.getBlockBuilderFaceWest;
                const oTile = this.getWallTile(idTile);
                if (!!oTile) {
                    return oTile.content;
                } else {
                    return '';
                }
            },

            getFaceEastContent: function() {
                const idTile = this.getBlockBuilderFaceEast;
                const oTile = this.getWallTile(idTile);
                if (!!oTile) {
                    return oTile.content;
                } else {
                    return '';
                }
            },

            getFaceSouthContent: function() {
                const idTile = this.getBlockBuilderFaceSouth;
                const oTile = this.getWallTile(idTile);
                if (!!oTile) {
                    return oTile.content;
                } else {
                    return '';
                }
            },

            getFaceFloorContent: function() {
                const idTile = this.getBlockBuilderFaceFloor;
                const oTile = this.getFlatTile(idTile);
                if (!!oTile) {
                    return oTile.content;
                } else {
                    return '';
                }
            },

            getFaceCeilingContent: function() {
                const idTile = this.getBlockBuilderFaceCeiling;
                const oTile = this.getFlatTile(idTile);
                if (!!oTile) {
                    return oTile.content;
                } else {
                    return '';
                }
            },
        },

        methods: {
            ...levelMapActions({
                createBlock: ACTION.CREATE_BLOCK,
                modifyBlock: ACTION.MODIFY_BLOCK
            }),

            ...editorMapMutations([
                MUTATION.BLOCKBUILDER_SET_FACE,
                MUTATION.BLOCKBUILDER_SET_ID
            ]),

            /**
             * Création d'un nouveau block
             * @param data
             */
            onFormSubmitCreate: function(data) {
                data.faces = {
                    n: this.getBlockBuilderFaceNorth,
                    e: this.getBlockBuilderFaceEast,
                    w: this.getBlockBuilderFaceWest,
                    s: this.getBlockBuilderFaceSouth,
                    f: this.getBlockBuilderFaceFloor,
                    c: this.getBlockBuilderFaceCeiling
                };
                this.createBlock(data);
                this.$router.push('/');
            },

            /**
             * Mise à jour d'un block existant
             * @param data
             */
            onFormSubmitUpdate: function(data) {
                data.id = this.getBlockBuilderId;
                data.faces = {
                    n: this.getBlockBuilderFaceNorth,
                    e: this.getBlockBuilderFaceEast,
                    w: this.getBlockBuilderFaceWest,
                    s: this.getBlockBuilderFaceSouth,
                    f: this.getBlockBuilderFaceFloor,
                    c: this.getBlockBuilderFaceCeiling
                };
                this.modifyBlock(data);
                this.$router.push('/');
                this[MUTATION.BLOCKBUILDER_SET_ID]({value: null});
            },

            handleDrop(face, id) {
                this[MUTATION.BLOCKBUILDER_SET_FACE]({face, value: id});
            },

            clearTile(face) {
                this[MUTATION.BLOCKBUILDER_SET_FACE]({face, value: null});
            },

            dupTile(face) {
                let c;
                switch (face) {
                    case 'n':
                        c = this.getBlockBuilderFaceNorth;
                        break;

                    case 'e':
                        c = this.getBlockBuilderFaceEast;
                        break;

                    case 'w':
                        c = this.getBlockBuilderFaceWest;
                        break;

                    case 's':
                        c = this.getBlockBuilderFaceSouth;
                        break;
                }
                this[MUTATION.BLOCKBUILDER_SET_FACE]({face: 'n', value: c});
                this[MUTATION.BLOCKBUILDER_SET_FACE]({face: 'e', value: c});
                this[MUTATION.BLOCKBUILDER_SET_FACE]({face: 'w', value: c});
                this[MUTATION.BLOCKBUILDER_SET_FACE]({face: 's', value: c});
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

    figure {
        margin: 1.2em;
    }

    figure span.clear-button {
        color: #A00;
        font-size: 1.3em;
        cursor: pointer;
    }

    figure span.clear-button:hover {
        color: #F00;
    }

    figure span.dup-button {
        color: #0000FF;
        font-size: 1.3em;
        cursor: pointer;
    }

    figure span.dup-button:hover {
        color: #06F;
    }
</style>