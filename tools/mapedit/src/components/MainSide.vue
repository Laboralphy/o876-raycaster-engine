<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Main Side"
    >
        <template v-slot:toolbar>
        </template>
        <div>Main side</div>
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