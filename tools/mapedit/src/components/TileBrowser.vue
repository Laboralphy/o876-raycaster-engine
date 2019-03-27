<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
        :caption="getTitle"
    >
        <template v-slot:toolbar>
            <Siblings @select="({index}) => selectTileFamily(index)">
                <SiblingButton hint="Display project wall tiles" :default="true"><WallIcon></WallIcon></SiblingButton>
                <SiblingButton hint="Display project flat tiles"><ViewGridIcon></ViewGridIcon></SiblingButton>
            </Siblings>
        </template>
        <div v-if="selectedFamily === 'wall'">
            <SelectableImage
                    v-for="image in getWallTiles"
                    :key="image.id"
                    :src="image.content"
            ></SelectableImage>
        </div>
        <div v-if="selectedFamily === 'flat'">
            <SelectableImage
                    v-for="image in getFlatTiles"
                    :key="image.id"
                    :src="image.content"
            ></SelectableImage>
        </div>
    </Window>
</template>

<script>
    import Window from "./Window.vue";
    import {createNamespacedHelpers} from 'vuex';
    import SelectableImage from "./SelectableImage.vue";
    import Siblings from "./Siblings.vue";
    import SiblingButton from "./SiblingButton.vue";
    import WallIcon from "vue-material-design-icons/Wall.vue";
    import ViewGridIcon from "vue-material-design-icons/ViewGrid.vue";

    const {mapGetters: levelMapGetters} = createNamespacedHelpers('level');

    export default {
        name: "TileBrowser",
        components: {
            ViewGridIcon,
            WallIcon,
            SiblingButton, Siblings, SibblingButton: SiblingButton, SelectableImage, Window},
        data: function() {
            return {
                tileFamily: [{
                    id: 'wall',
                    caption: 'Walls'
                }, {
                    id: 'flat',
                    caption: 'Flats'
                }],

                selectedFamily: 'wall'
            }
        },
        computed: {
            ...levelMapGetters([
                'getWallTiles',
                'getFlatTiles',
            ]),

            getTitle: function() {
                return this.selectedFamily === 'wall'
                    ? 'Wall Tile browser - ' + this.getWallTiles.length + ' tile' + this.pluralWallTiles
                    : 'Flat Tile browser - ' + this.getFlatTiles.length + ' tile' + this.pluralFlatTiles
            },

            pluralWallTiles: function() {
                return this.getWallTiles.length > 1 ? 's' : '';
            },

            pluralFlatTiles: function() {
                return this.getFlatTiles.length > 1 ? 's' : '';
            }
        },

        methods: {
            selectTileFamily: function(index) {
                switch (index) {
                    case 0:
                        this.selectedFamily = 'wall';
                        break;

                    case 1:
                        this.selectedFamily = 'flat';
                        break;
                }
            }
        }
    }
</script>

<style scoped>

</style>