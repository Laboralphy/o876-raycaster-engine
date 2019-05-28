<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Raycaster Map Editor"
    >
        <template v-slot:toolbar>
        </template>
        <div>
            <div align="center">
                <img class="splash-image" src="../../assets/images/splash.png" />
            </div>
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
    img.splash-image {
        margin-top: 15vh;
    }

    p.main-tile {
        font-size: 5em;
        font-family: Arial, sans-serif;
        font-style: italic;
        font-weight: bold;
    }
</style>