<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Raycaster Map Editor"
    >
        <template v-slot:toolbar="">
        </template>
        <div>
            <div class="center-text">
                <img alt="O876 RC MAPEDIT - For the O876 Raycasting Engine" class="splash-image" src="../../assets/images/splash.png" />
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
        width: 60vw;
    }

    .center-text {
        text-align: center;
    }
</style>