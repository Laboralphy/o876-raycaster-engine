<template>
    <Window
        caption="Tile browser"
    >
        <h3 class="title">Walls</h3><h3 class="counter">({{ getWallTiles.length }} tile{{ pluralWallTiles }})</h3>
        <SelectableImage
                v-for="image in getWallTiles"
                :key="image.id"
                :src="image.content"
        ></SelectableImage>
    </Window>
</template>

<script>
    import Window from "./Window.vue";
    import {createNamespacedHelpers} from 'vuex';
    import SelectableImage from "./SelectableImage.vue";

    const {mapGetters: levelMapGetters} = createNamespacedHelpers('level');

    export default {
        name: "TileBrowser",
        components: {SelectableImage, Window},
        computed: {
            ...levelMapGetters([
                'getWallTiles',
                'getFlatTiles',
            ]),

            pluralWallTiles: function() {
                return this.getWallTiles.length > 1 ? 's' : '';
            },

            pluralFlatTiles: function() {
                return this.getFlatTiles.length > 1 ? 's' : '';
            }
        }
    }
</script>

<style scoped>
    .title {
        float: left;
    }
    .counter {
        color: rgb(128, 128, 128);
        font-style: italic;
        margin-left: 4em;
    }
</style>