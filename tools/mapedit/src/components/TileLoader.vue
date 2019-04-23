<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Tile loader"
    >
        <template v-slot:toolbar>
            <HomeButton></HomeButton>
            <ImageLoader
                    hint="Import a wall tileset from an image"
                    @load="onWallImageLoaded"
            ><WallIcon></WallIcon> Load walls</ImageLoader>
            <ImageLoader
                    hint="Import a flat tileset from an image"
                    @load="onFlatImageLoaded"
            ><ViewGridIcon></ViewGridIcon> Load flats</ImageLoader>
            <MyButton
                    hint="Import all selected tiles into current project"
                    @click="doImport"
            ><ImportIcon></ImportIcon> Import</MyButton>
        </template>
        <div v-if="wallImages.length === 0 && flatImages.length === 0">
            <h3>Tileset importation</h3>
            <ul>
                <li>Click on "<WallIcon></WallIcon>" or "<ViewGridIcon></ViewGridIcon>" to load tilesets.</li>
                <li>Click on tiles to select them. Click again to toggle selection.</li>
                <li>Click on "<ImportIcon></ImportIcon> Import" to copy the selected tiles into the current project, and make them available as wall, floor or ceiling textures.</li>
            </ul>
        </div>
        <div v-else-if="wallImages.length > 0">
            <h3>Wall tiles ({{ getTileWidth }} * {{ getTileHeight }})</h3>
            <SelectableImage
                    v-for="image in wallImages"
                    :tileId="image.id"
                    :key="image.id"
                    :src="image.src"
                    @selected="({value}) => setTileSelection(image, value)"
            />
        </div>
        <div v-else-if="flatImages.length > 0">
            <h3>Flat tiles ({{ getTileWidth }} * {{ getTileWidth }})</h3>
            <SelectableImage
                    v-for="image in flatImages"
                    :tileId="image.id"
                    :key="image.id"
                    :src="image.src"
                    @selected="({value}) => setTileSelection(image, value)"
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
    import SelectableImage from "./SelectableImage.vue";
    import HomeButton from "./HomeButton.vue";
    import MyButton from "./MyButton.vue";
    import ImportIcon from "vue-material-design-icons/Import.vue";
    import WallIcon from "vue-material-design-icons/Wall.vue";
    import ViewGridIcon from "vue-material-design-icons/ViewGrid.vue";


    const {mapGetters: levelMapGetter, mapActions: levelMapActions} = createNamespacedHelpers('level');


    let IMAGE_LAST_ID = 0;


    export default {
        name: "WallTileLoader",
        components: {
            ViewGridIcon,
            WallIcon, ImportIcon, MyButton, HomeButton, SelectableImage, ImageLoader, Window},
        computed: {
            ...levelMapGetter([
                'getTileHeight',
                'getTileWidth',
            ])
        },
        data: function() {
            return {
                wallImages: [],
                flatImages: [],
                loadedTypeTiles: '',
                commands: [{
                    // return to main view
                    caption: '↩',
                    hint: 'Close the tileset loader',
                    id: 'c_return'
                }]
            };
        },
        methods: {
            ...levelMapActions({
                importTile: ACTION.LOAD_TILE
            }),

            setTileSelection: function(tile, value) {
                tile.selected = value;
            },

            clearTiles: function() {
                this.flatImages.splice(0, this.flatImages.length);
                this.wallImages.splice(0, this.wallImages.length);
            },

            onWallImageLoaded: async function(event) {
                this.clearTiles();
                const tss = new TilesetSplitter();
                const aImages = await tss.split(event.data, this.getTileWidth, this.getTileHeight);
                aImages.forEach(img => this.wallImages.push({id: ++IMAGE_LAST_ID, src: img}));
                this.loadedTypeTiles = 'wall';
            },

            onFlatImageLoaded: async function(event) {
                this.clearTiles();
                const tss = new TilesetSplitter();
                const aImages = await tss.split(event.data, this.getTileWidth, this.getTileWidth);
                aImages.forEach(img => this.flatImages.push({id: ++IMAGE_LAST_ID, src: img}));
                this.loadedTypeTiles = 'flat';
            },

            doImportType: function(type, images) {
                const tiles = images.filter(t => t.selected);
                tiles.forEach(t => {
                    this.importTile({type, content: t.src});
                });
                for (let i = images.length - 1; i >= 0; --i) {
                    if (images[i].selected) {
                        images.splice(i, 1);
                    }
                }
            },

            doImport: function() {
                switch (this.loadedTypeTiles) {
                    case 'wall':
                        this.doImportType('wall', this.wallImages);
                        break;

                    case 'flat':
                        this.doImportType('flat', this.flatImages);
                        break;
                }
            }
        }
    }
</script>

<style scoped>
    .choice {
        width: 9em;
    }
</style>