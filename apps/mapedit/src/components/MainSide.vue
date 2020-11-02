<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="About..."
    >
        <template v-slot:toolbar>
        </template>
        <p>
            This editor is used to easily design levels for the <br/>
            <code><b>O 8 7 6</b></code> Raycasting Game Engine Framework.
        </p>
        <ul>
            <li>Author: Raphaël Marandet</li>
            <li>Project GitHub repository : <a href="https://github.com/Laboralphy/o876-raycaster-engine">https://github.com/Laboralphy/o876-raycaster-engine</a></li>
        </ul>
    </Window>
</template>

<script>
    import Window from "./Window.vue";
    export default {
        name: "MainSide",
        components: {Window}
    }
</script>

<style scoped>

</style>