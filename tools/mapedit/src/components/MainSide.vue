<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="About..."
    >
        <template v-slot:toolbar>
        </template>
        <div>
            This editor is used to design levels for the <br/>
            <code><b>L a b o r a l p h y</b></code> Raycasting Game Engine Framework.
        </div>
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