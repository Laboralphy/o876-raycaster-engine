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
        </template>
        <div>Youpi</div>
    </Window>
</template>

<script>
    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import MapIcon from "vue-material-design-icons/Map.vue";
    import OfficeBuildingIcon from "vue-material-design-icons/OfficeBuilding.vue";
    export default {
        name: "LevelGrid",
        components: {MapIcon, OfficeBuildingIcon, MyButton, Window}
    }
</script>

<style scoped>

</style>