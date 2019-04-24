<template>
    <StatusBar>
        <MyButton
                title="Load tileset and import wall and flat tiles"
                @click="$router.push('/load-tiles')"
        ><MapIcon title="Load tileset and import wall and flat tiles"></MapIcon> Tiles</MyButton>
        <MyButton
                title="Build physical blocks out of tiles"
                @click="$router.push('/build-blocks')"
        ><OfficeBuildingIcon title="Build physical blocks out of tiles"></OfficeBuildingIcon> Blocks</MyButton>
        <MyButton
                hint="Make animated textures"
                @click="$router.push('/build-anim')"
        ><FilmstripIcon title="Make animated textures"></FilmstripIcon> Anim.</MyButton>
    </StatusBar>
</template>

<script>
    import StatusBar from "./StatusBar.vue";
    import MyButton from "./MyButton.vue";
    import MapIcon from "vue-material-design-icons/Map.vue";
    import OfficeBuildingIcon from "vue-material-design-icons/OfficeBuilding.vue";
    import FilmstripIcon from "vue-material-design-icons/Filmstrip.vue";
    export default {
        name: "MainMenu",
        components: {FilmstripIcon, OfficeBuildingIcon, MapIcon, MyButton, StatusBar}
    }
</script>

<style scoped>

</style>