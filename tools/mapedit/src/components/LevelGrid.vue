<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
        caption="Level grid"
    >
        <template v-slot:toolbar="1">
        </template>
        <div>
        </div>
    </Window>
</template>

<script>
    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import MapIcon from "vue-material-design-icons/Map.vue";
    import OfficeBuildingIcon from "vue-material-design-icons/OfficeBuilding.vue";
    import FilmstripIcon from "vue-material-design-icons/Filmstrip.vue";
    import Tile from "./Tile.vue";
    export default {
        name: "LevelGrid",
        components: {Tile, FilmstripIcon, MapIcon, OfficeBuildingIcon, MyButton, Window}
    }
</script>

<style scoped>

</style>