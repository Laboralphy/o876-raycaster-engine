<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
        caption="Level grid"
    >
    <template v-slot:toolbar>
        <MyButton @click="$router.push('/load-tiles')"><MapIcon></MapIcon> Tiles</MyButton>
        <MyButton @click="$router.push('/load-tiles')"><MapIcon></MapIcon> Tiles</MyButton>
    </template>

        Youpi</Window>
</template>

<script>
    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import MapIcon from "vue-material-design-icons/Map.vue";
    export default {
        name: "LevelGrid",
        components: {MapIcon, MyButton, Window}
    }
</script>

<style scoped>

</style>