<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
        caption="Level grid"
    >
        <template v-slot:toolbar>
            <MyButton
                    title="Go to tile loading screen"
                    @click="$router.push('/load-tiles')"
            ><MapIcon></MapIcon> Tiles</MyButton>
            <MyButton
                    title="Go to block building screen"
                    @click="$router.push('/build-blocks')"
            ><OfficeBuildingIcon></OfficeBuildingIcon> Blocks</MyButton>
            <MyButton
                    hint="Go to animation builder"
                    @click="$router.push('/build-anim')"
            ><FilmstripIcon title="Go to animation builder"></FilmstripIcon> Anim.</MyButton>
        </template>
        <div>Youpi</div>
    </Window>
</template>

<script>
    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import MapIcon from "vue-material-design-icons/Map.vue";
    import OfficeBuildingIcon from "vue-material-design-icons/OfficeBuilding.vue";
    import FilmstripIcon from "vue-material-design-icons/Filmstrip.vue";
    export default {
        name: "LevelGrid",
        components: {FilmstripIcon, MapIcon, OfficeBuildingIcon, MyButton, Window}
    }
</script>

<style scoped>

</style>