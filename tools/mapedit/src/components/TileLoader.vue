<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Tile loader"
    >
        <template v-slot:toolbar>
            <ReturnButton></ReturnButton>
        </template>
        <div v-if="wallImages.length === 0 && flatImages.length === 0">
            <h3>Tileset importation</h3>
            <ul>
                <li><button type="button" @click="$router.push('/walltileload')">Import <b>wall</b> tiles</button></li>
                <li><button type="button" @click="$router.push('/flattileload')">Import <b>flat</b> tiles</button></li>
            </ul>
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
        name: "TileLoader",
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
                wallImages: [],
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

            onWallImageLoaded: async function(event) {
                const tss = new TilesetSplitter();
                const aImages = await tss.split(event.data, this.getTileWidth, this.getTileHeight);
                aImages.forEach(img => this.wallImages.push({id: ++IMAGE_LAST_ID, src: img}));
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
                this.doImportType('wall', this.wallImages);
                this.doImportType('flat', this.flatImages);
            }
        }
    }
</script>

<style scoped>

</style>
< script >
import ReturnButton from "./ReturnButton";
export default {
    components: {ReturnButton}
}
                    </script>