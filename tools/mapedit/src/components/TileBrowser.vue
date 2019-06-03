<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
        :caption="getTitle"
    >
        <template v-slot:toolbar>
            <Siblings ref="tileType" @input="({index}) => selectTileTypeIndex(index)">
                <SiblingButton title="Display project wall tiles" :default="true"><WallIcon title="Display project wall tiles" decorative></WallIcon></SiblingButton>
                <SiblingButton title="Display project flat tiles"><ViewGridIcon title="Display project flat tiles" decorative></ViewGridIcon></SiblingButton>
                <SiblingButton title="Display project sprite tiles"><ChessRookIcon title="Display project sprite tiles" decorative></ChessRookIcon></SiblingButton>
            </Siblings>
            <MyButton
                    title="Delete the selected tiles"
                    @click="deleteClick"
                    :disabled="getSelectedTileCount === 0"
            ><DeleteIcon title="Delete the selected tiles" decorative></DeleteIcon></MyButton>
        </template>
        <div v-if="selectedTileType === CONSTS.TILE_TYPE_WALL">
            <Tile
                    v-for="image in getWallTiles"
                    :content="image.content"
                    :width="getTileWidth"
                    :height="getTileHeight"
                    :key="image.id"
                    :tile="image.id"
                    :anim="!!image.animation"
                    :draggable="true"
                    :dropzone="true"
                    @drop="({incoming}) => handleDrop(image.id, incoming)"
                    @select="({value}) => setTileSelection(image.id, value)"
            ></Tile>
        </div>
        <div v-if="selectedTileType === CONSTS.TILE_TYPE_FLAT">
            <Tile
                    v-for="image in getFlatTiles"
                    :content="image.content"
                    :width="getTileWidth"
                    :height="getTileWidth"
                    :key="image.id"
                    :tile="image.id"
                    :anim="!!image.animation"
                    :draggable="true"
                    :dropzone="true"
                    @drop="({incoming}) => handleDrop(image.id, incoming)"
                    @select="({value}) => setTileSelection(image.id, value)"
            ></Tile>
        </div>
        <div v-if="selectedTileType === CONSTS.TILE_TYPE_SPRITE">
            <Tile
                    v-for="image in getSpriteTiles"
                    :content="image.content"
                    :width="96"
                    :height="96"
                    :key="image.id"
                    :tile="image.id"
                    :anim="!!image.animation"
                    :draggable="true"
                    :dropzone="true"
                    @drop="({incoming}) => handleDrop(image.id, incoming)"
                    @select="({value}) => setTileSelection(image.id, value)"
            ></Tile>
        </div>
    </Window>
</template>

<script>
    import * as ACTION from '../store/modules/level/action-types';
    import * as EDITOR_MUTATION from '../store/modules/editor/mutation-types';
    import * as CONSTS from '../consts';
    import {createNamespacedHelpers} from 'vuex';
    import Window from "./Window.vue";
    import Siblings from "./Siblings.vue";
    import SiblingButton from "./SiblingButton.vue";
    import WallIcon from "vue-material-design-icons/Wall.vue";
    import ViewGridIcon from "vue-material-design-icons/ViewGrid.vue";
    import MyButton from "./MyButton.vue";
    import Tile from "./Tile.vue";
    import DeleteIcon from "vue-material-design-icons/Delete.vue";
    import ContentDuplicateIcon from "vue-material-design-icons/ContentDuplicate.vue";
    import AnimationPlayIcon from "vue-material-design-icons/AnimationPlay.vue";
    import ChessRookIcon from "vue-material-design-icons/ChessRook.vue";

    const {mapGetters: levelMapGetters, mapActions: levelMapActions} = createNamespacedHelpers('level');
    const {mapGetters: editorMapGetters, mapMutations: editorMapMutations} = createNamespacedHelpers('editor');

    export default {
        name: "TileBrowser",
        components: {
            ChessRookIcon,
            AnimationPlayIcon,
            ContentDuplicateIcon,
            DeleteIcon,
            Tile,
            MyButton,
            ViewGridIcon,
            WallIcon,
            SiblingButton,
            Siblings,
            Window
        },
        data: function() {
            return {
                tileFamily: [{
                    id: CONSTS.TILE_TYPE_WALL,
                    caption: 'Walls'
                }, {
                    id: CONSTS.TILE_TYPE_FLAT,
                    caption: 'Flats'
                }, {
                    id: CONSTS.TILE_TYPE_SPRITE,
                    caption: 'Sprites'
                }],

                _selectedTileType: CONSTS.TILE_TYPE_WALL,
                CONSTS,

                selectedTiles: {},
            }
        },

        watch: {
            getTileBrowserType: {
                handler: function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        this.selectedTileType = newValue;
                        this.$refs.tileType.selectSiblingIndex(this.selectedTileTypeIndex);
                    }
                }
            }
        },

        computed: {
            ...levelMapGetters([
                'getWallTiles',
                'getFlatTiles',
                'getSpriteTiles',
                'getTileWidth',
                'getTileHeight',
                'getTile'
            ]),


            ...editorMapGetters([
                'getTileBrowserType'
            ]),

            selectedTileType: {
                get () {
                    return this.getTileBrowserType;
                },

                set (value) {
                    this.selectTileType({value});
                }
            },

            selectedTileTypeIndex: function() {
                switch (this.selectedTileType) {
                    case CONSTS.TILE_TYPE_WALL:
                        return 0;

                    case CONSTS.TILE_TYPE_FLAT:
                        return 1;

                    case CONSTS.TILE_TYPE_SPRITE:
                        return 2;
                }
            },

            getSelectedTileCount: function() {
                let c = 0;
                for (let i in this.selectedTiles) {
                    if (this.selectedTiles[i]) {
                        ++c;
                    }
                }
                return c;
            },

            getTitle: function() {
                switch (this.selectedTileType) {
                    case CONSTS.TILE_TYPE_WALL:
                        return 'Wall Tile browser - ' + this.getWallTiles.length + ' tile' + this.pluralWallTiles;

                    case CONSTS.TILE_TYPE_FLAT:
                        return 'Flat Tile browser - ' + this.getFlatTiles.length + ' tile' + this.pluralFlatTiles;

                    case CONSTS.TILE_TYPE_SPRITE:
                        return 'Sprite Tile browser - ' + this.getSpriteTiles.length + ' tile' + this.pluralSpriteTiles;
                }
            },

            pluralWallTiles: function() {
                return this.getWallTiles.length > 1 ? 's' : '';
            },

            pluralFlatTiles: function() {
                return this.getFlatTiles.length > 1 ? 's' : '';
            },

            pluralSpriteTiles: function() {
                return this.getSpriteTiles.length > 1 ? 's' : '';
            }
        },

        methods: {

            ...levelMapActions({
                reorderTile: ACTION.REORDER_TILE,
                deleteTile: ACTION.DELETE_TILE
            }),


            ...editorMapMutations({
                selectTileType: EDITOR_MUTATION.TILEBROWSER_SET_TILE_TYPE
            }),

            setTileSelection: function(idTile, value) {
                if (idTile in this.selectedTiles) {
                    this.selectedTiles[idTile] = value;
                } else {
                    this.$set(this.selectedTiles, idTile, value);
                }
            },

            clearTileSelection: function() {
                for (let id in this.selectedTiles) {
                    this.setTileSelection(id, false);
                }
            },

            selectTileTypeIndex: function(index) {
                this.clearTileSelection();
                switch (index) {
                    case 0:
                        this.selectedTileType = CONSTS.TILE_TYPE_WALL;
                        break;

                    case 1:
                        this.selectedTileType = CONSTS.TILE_TYPE_FLAT;
                        break;

                    case 2:
                        this.selectedTileType = CONSTS.TILE_TYPE_SPRITE;
                        break;
                }
            },

            /**
             * gestion du déplacement de tile dans le browser
             * @param id {number} tile qui a recu une autre tile en drop
             * @param incoming {number} identifiant de la tile qui a été draggée et droppée
             */
            handleDrop: function(id, incoming) {
                const oMovingTile = this.getTile(incoming);
                const oTargetTile = this.getTile(id);
                if (!oMovingTile || !oTargetTile) {
                    // l'une des tile ne fait pas partie du store
                    return;
                }
                if (oMovingTile.type !== oTargetTile.type) {
                    // les tiles ne sont pas du même type
                    return;
                }
                this.reorderTile({
                    idSource: oMovingTile.id,
                    idTarget: oTargetTile.id
                });
            },

            deleteClick: function() {
                const l = this.getSelectedTileCount;
                if (l <= 0) {
                    return;
                }
                const sPrompt = l > 1
                    ? 'Delete these ' + l + ' tiles ?'
                    : 'Delete this tile ?';

                if (!confirm(sPrompt)) {
                    return;
                }
                for (let id in this.selectedTiles) {
                    if (this.selectedTiles[id]) {
                        this.setTileSelection(id, false);
                        this.deleteTile({id: parseInt(id)});
                    }
                }
            },
        },

        mounted: function() {
            this.$refs.tileType.selectSiblingIndex(this.selectedTileTypeIndex);
        }
    }
</script>

<style scoped>

</style>