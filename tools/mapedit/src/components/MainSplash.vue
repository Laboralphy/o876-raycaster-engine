<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Raycaster Map Editor"
    >
        <template v-slot:toolbar>
        </template>
        <div>
            <div align="center">
                <p class="main-tile">RAYCASTER MAP EDITOR</p>
            </div>
            <div align="center">
<!--                <img class="splash-image" src="../../assets/images/rc-anim-splash.gif" />-->
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
        box-shadow: 0 0 3em rgb(0, 0, 0);
    }

    p.main-tile {
        font-size: 5em;
        font-family: Arial, sans-serif;
        font-style: italic;
        font-weight: bold;
    }
</style>