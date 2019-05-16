<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Tile loader"
    >
        <template v-slot:toolbar>
            <ImageLoader
                    hint="Import a wall tileset from an image"
                    @load="onWallImageLoaded"
            ><WallIcon title="Import a wall tileset from an image"></WallIcon> Load walls</ImageLoader>
            <ImageLoader
                    hint="Import a flat tileset from an image"
                    @load="onFlatImageLoaded"
            ><ViewGridIcon title="Import a flat tileset from an image"></ViewGridIcon> Load flats</ImageLoader>
            <ImageLoader
                    hint="Import a single tile from an image to make a sprite"
                    @load="onSpriteImageLoaded"
                    :multiple="true"
            ><ChessRookIcon title="Import a single tile from an image to make a sprite"></ChessRookIcon> Load sprites</ImageLoader>
            <MyButton
                    :disabled="!isThereImageToDisplay"
                    title="Import all selected tiles into current project"
                    @click="doImport"
            ><ImportIcon title="Import all selected tiles into current project"></ImportIcon> Import</MyButton>
        </template>
        <div v-if="!isThereImageToDisplay">
            <h3>Tileset importation</h3>
            <ul>
                <li>Click on "<WallIcon></WallIcon>" or "<ViewGridIcon></ViewGridIcon>" to load tilesets.</li>
                <li>Click on tiles to select them. Click again to toggle selection.</li>
                <li>Click on "<ImportIcon></ImportIcon> Import" to copy the selected tiles into the current project, and make them available as wall, floor or ceiling textures.</li>
            </ul>
        </div>
        <div v-else-if="wallImages.length > 0">
            <h3>Wall tiles ({{ getTileWidth }} * {{ getTileHeight }})</h3>
            <Tile
                    v-for="image in wallImages"
                    :tile="image.id"
                    :key="image.id"
                    :content="image.src"
                    :width="getTileWidth"
                    :height="getTileHeight"
                    @select="({value}) => setTileSelection(image, value)"
            />
        </div>
        <div v-else-if="flatImages.length > 0">
            <h3>Flat tiles ({{ getTileWidth }} * {{ getTileWidth }})</h3>
            <Tile
                    v-for="image in flatImages"
                    :tile="image.id"
                    :key="image.id"
                    :content="image.src"
                    :width="getTileWidth"
                    :height="getTileWidth"
                    @select="({value}) => setTileSelection(image, value)"
            />
        </div>
        <div v-else-if="spriteImages.length > 0">
            <h3>Sprite tile</h3>
            <Tile
                    v-for="image in spriteImages"
                    :tile="image.id"
                    :key="image.id"
                    :content="image.src"
                    :width="image.width"
                    :height="image.height"
                    @select="({value}) => setTileSelection(image, value)"
            />
        </div>
    </Window>
</template>

<script>
    // libraries
    import TilesetSplitter from '../libraries/tileset-splitter';

    // vuex
    import {createNamespacedHelpers} from'vuex';
    import * as ACTION from '../store/modules/level/action-types';

    // components
    import Window from "./Window.vue";
    import ImageLoader from "./ImageLoader.vue";
    import HomeButton from "./HomeButton.vue";
    import MyButton from "./MyButton.vue";
    import ImportIcon from "vue-material-design-icons/Import.vue";
    import WallIcon from "vue-material-design-icons/Wall.vue";
    import ViewGridIcon from "vue-material-design-icons/ViewGrid.vue";
    import Tile from "./Tile.vue";
    import * as CONSTS from "../consts";
    import ChessRookIcon from "vue-material-design-icons/ChessRook.vue";
    import CanvasHelper from "../../../../src/canvas-helper";
    import DeleteIcon from "vue-material-design-icons/Delete.vue";
    import SelectAllIcon from "vue-material-design-icons/SelectAll.vue";
    import SelectOffIcon from "vue-material-design-icons/SelectOff.vue";


    const {mapGetters: levelMapGetter, mapActions: levelMapActions} = createNamespacedHelpers('level');


    let IMAGE_LAST_ID = 0;


    export default {
        name: "WallTileLoader",
        components: {
            SelectOffIcon,
            SelectAllIcon,
            DeleteIcon,
            ChessRookIcon,
            Tile,
            ViewGridIcon,
            WallIcon,
            ImportIcon,
            MyButton,
            HomeButton,
            ImageLoader,
            Window
        },
        computed: {
            ...levelMapGetter([
                'getTileHeight',
                'getTileWidth',
            ]),

            isThereImageToDisplay: function() {
                return this.wallImages.length > 0 || this.flatImages.length > 0 || this.spriteImages.length > 0;
            }
        },
        data: function() {
            return {
                wallImages: [],
                flatImages: [],
                spriteImages: [],
                loadedTypeTiles: '',
                commands: [{
                    // return to main view
                    caption: '↩',
                    title: 'Close the tileset loader',
                    id: 'c_return'
                }]
            };
        },
        methods: {
            ...levelMapActions({
                importTile: ACTION.LOAD_TILE,
                importTiles: ACTION.LOAD_TILES
            }),

            setTileSelection: function(tile, value) {
                tile.selected = value;
            },

            clearTiles: function() {
                this.flatImages.splice(0, this.flatImages.length);
                this.wallImages.splice(0, this.wallImages.length);
                this.spriteImages.splice(0, this.spriteImages.length);
            },

            onWallImageLoaded: async function(event) {
                this.clearTiles();
                const tss = new TilesetSplitter();
                const aImages = await tss.split(event.data, this.getTileWidth, this.getTileHeight);
                aImages.forEach(img => this.wallImages.push({id: ++IMAGE_LAST_ID, src: img}));
                this.loadedTypeTiles = CONSTS.TILE_TYPE_WALL;
            },

            onFlatImageLoaded: async function(event) {
                this.clearTiles();
                const tss = new TilesetSplitter();
                const aImages = await tss.split(event.data, this.getTileWidth, this.getTileWidth);
                aImages.forEach(img => this.flatImages.push({id: ++IMAGE_LAST_ID, src: img}));
                this.loadedTypeTiles = CONSTS.TILE_TYPE_FLAT;
            },

            onSpriteImageLoaded: async function(event) {
                this.clearTiles();
                const oImage = await CanvasHelper.loadCanvas(event.data);
                this.spriteImages.push({id: ++IMAGE_LAST_ID, src: oImage.toDataURL('image/png'), width: oImage.width, height: oImage.height});
                this.loadedTypeTiles = CONSTS.TILE_TYPE_SPRITE;
            },

            /**
             * importation des image spécifiée en tant que tile flat ou wall
             * @param type {string} TILE_TYPE_*
             * @param images {array} tableau d'image
             */
            doImportType: function(type, images) {
                const aSrc = [];
                for (let i = images.length - 1; i >= 0; --i) {
                    const t = images[i];
                    if (t.selected) {
                        aSrc.push(t.src);
                        images.splice(i, 1);
                    }
                }
                this.importTiles({type, contents: aSrc});
            },

            doImport: function() {
                switch (this.loadedTypeTiles) {
                    case CONSTS.TILE_TYPE_WALL:
                        this.doImportType(CONSTS.TILE_TYPE_WALL, this.wallImages);
                        break;

                    case CONSTS.TILE_TYPE_FLAT:
                        this.doImportType(CONSTS.TILE_TYPE_FLAT, this.flatImages);
                        break;

                    case CONSTS.TILE_TYPE_SPRITE:
                        this.doImportType(CONSTS.TILE_TYPE_SPRITE, this.spriteImages);
                        break;

                }
            }
        }
    }
</script>

<style scoped>
</style>