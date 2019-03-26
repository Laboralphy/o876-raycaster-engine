<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Flat tile loader"
    >
        <template v-slot:toolbar>
            <ReturnButton></ReturnButton>
            Load a tileset :
            <ImageLoader
                    hint="Import a flat tileset from an image"
                    @load="onFlatImageLoaded"
            >{{ EMOJI.FRAME_WITH_PICTURE }} load</ImageLoader>
            <button
                    type="button"
                    title="Import all selected tiles into current project"
                    @click="doImport"
            >{{ EMOJI.INBOX_TRAY }} import</button>
        </template>
        <div v-if="flatImages.length === 0">
            <h3>Tileset importation</h3>
            <ul>
                <li>Click on "{{ EMOJI.FRAME_WITH_PICTURE }} load" to load tilesets.</li>
                <li>Click on tiles to select them. Click again to toggle selection.</li>
                <li>Click on "{{ EMOJI.INBOX_TRAY }} import" to copy the selected tiles into the current project, and make them available as flat, floor or ceiling textures.</li>
            </ul>
        </div>
        <div v-else>
            <h3>Flat tiles ({{ getTileWidth }} * {{ getTileHeight }})</h3>
            <SelectableImage
                    v-for="image in flatImages"
                    :key="image.id"
                    :src="image.src"
                    @selected="({value}) => setTileSelection(image, value)"
            />
        </div>
    </Window>
</template>

<script>
    // libraries
    import * as EMOJI from '../libraries/emoji';
    import TilesetSplitter from '../libraries/tileset-splitter';

    // vuex
    import {createNamespacedHelpers} from'vuex';
    import * as ACTION from '../store/modules/level/action-types';

    // components
    import Window from "./Window.vue";
    import ButtonBar from "./ButtonBar.vue";
    import ImageLoader from "./ImageLoader.vue";
    import SelectableImage from "./SelectableImage.vue";
    import ReturnButton from "./ReturnButton.vue";


    const {mapGetters: levelMapGetter, mapActions: levelMapActions} = createNamespacedHelpers('level');


    let IMAGE_LAST_ID = 0;


    export default {
        name: "FlatTileLoader",
        components: {ReturnButton, SelectableImage, ImageLoader, ButtonBar, Window},
        computed: {
            ...levelMapGetter([
                'getTileHeight',
                'getTileWidth',
            ])
        },
        data: function() {
            return {
                EMOJI,
                flatImages: [],
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

            onFlatImageLoaded: async function(event) {
                const tss = new TilesetSplitter();
                const aImages = await tss.split(event.data, this.getTileWidth, this.getTileWidth);
                aImages.forEach(img => this.flatImages.push({id: ++IMAGE_LAST_ID, src: img}));
            },

            onCommand: function({id}) {
                switch (id) {
                    case 'c_load':
                        break;
                }
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
                this.doImportType('flat', this.flatImages);
            }
        }
    }
</script>

<style scoped>

</style>