<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Raycaster Map Editor"
    >
        <template v-slot:toolbar>
        </template>
        <div>
            RC MAP EDITOR
        </div>
    </Window>
</template>

<script>
    import Window from "./Window.vue";
    export default {
        name: "MainSplash",
        components: {Window}
    }
</script>

<style scoped>

</style>