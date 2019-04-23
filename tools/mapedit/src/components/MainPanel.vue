<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Main panel"
    >
        <template v-slot:toolbar>
        </template>
        <div>Main panel</div>
    </Window>
</template>

<script>
    import Window from "./Window.vue";
    export default {
        name: "MainPanel",
        components: {Window}
    };
</script>

<style scoped>

</style>
