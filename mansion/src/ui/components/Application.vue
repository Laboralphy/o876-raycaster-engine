<template>
    <HUD></HUD>
    <Info></Info>
</template>

<script>
    import HUD from "./HUD.vue";
    import Info from "./Info.vue";
    export default {
        name: "Application",
        components: {HUD, Info}
    }
</script>

<style scoped>

</style>