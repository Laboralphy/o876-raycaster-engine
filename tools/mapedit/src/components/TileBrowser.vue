<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
        :caption="getTitle"
    >
        <template v-slot:toolbar>
            <Siblings @input="({index}) => selectTileFamily(index)">
                <SiblingButton title="Display project wall tiles" :default="true"><WallIcon title="Display project wall tiles" decorative></WallIcon></SiblingButton>
                <SiblingButton title="Display project flat tiles"><ViewGridIcon title="Display project flat tiles" decorative></ViewGridIcon></SiblingButton>
            </Siblings>
            <MyButton title="Delete the selected tiles" @click="deleteClick"><DeleteIcon title="Delete the selected tiles" decorative></DeleteIcon></MyButton>
        </template>
        <div v-if="selectedFamily === CONSTS.TILE_TYPE_WALL">
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
                    @selected="({value}) => setTileSelection(image.id, value)"
            ></Tile>
        </div>
        <div v-if="selectedFamily === CONSTS.TILE_TYPE_FLAT">
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
                    @selected="({value}) => setTileSelection(image.id, value)"
            ></Tile>
        </div>
    </Window>
</template>

<script>
    import * as ACTION from '../store/modules/level/action-types';
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

    const {mapGetters: levelMapGetters, mapActions: levelMapActions} = createNamespacedHelpers('level');

    export default {
        name: "TileBrowser",
        components: {
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
                }],

                selectedFamily: CONSTS.TILE_TYPE_WALL,
                CONSTS,

                selectedTiles: {},
            }
        },
        computed: {
            ...levelMapGetters([
                'getWallTiles',
                'getFlatTiles',
                'getTileWidth',
                'getTileHeight',
                'getTile'
            ]),

            getTitle: function() {
                return this.selectedFamily === CONSTS.TILE_TYPE_WALL
                    ? 'Wall Tile browser - ' + this.getWallTiles.length + ' tile' + this.pluralWallTiles
                    : 'Flat Tile browser - ' + this.getFlatTiles.length + ' tile' + this.pluralFlatTiles
            },

            pluralWallTiles: function() {
                return this.getWallTiles.length > 1 ? 's' : '';
            },

            pluralFlatTiles: function() {
                return this.getFlatTiles.length > 1 ? 's' : '';
            },

            areSomeTileSelected: function() {
                for (let id in this.selectedTiles) {
                    if (this.selectedTiles[id]) {
                        return true;
                    }
                }
                return false;
            }
        },

        methods: {

            ...levelMapActions({
                reorderTile: ACTION.REORDER_TILE,
                deleteTile: ACTION.DELETE_TILE
            }),

            setTileSelection: function(idTile, value) {
                this.selectedTiles[idTile] = value;
            },

            clearTileSelection: function() {
                for (let id in this.selectedTiles) {
                    this.selectedTiles[id] = false;
                }
            },

            selectTileFamily: function(index) {
                this.clearTileSelection();
                switch (index) {
                    case 0:
                        this.selectedFamily = CONSTS.TILE_TYPE_WALL;
                        break;

                    case 1:
                        this.selectedFamily = CONSTS.TILE_TYPE_FLAT;
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
                for (let id in this.selectedTiles) {
                    if (this.selectedTiles[id]) {
                        this.selectedTiles[id] = false;
                        this.deleteTile({id: parseInt(id)});
                    }
                }
            },
        }
    }
</script>

<style scoped>

</style>