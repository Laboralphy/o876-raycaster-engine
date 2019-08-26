<template>
    <div class="app">

        <HUD pos="tl"><p>top left</p></HUD>
        <HUD pos="bl"><p>bottom left</p></HUD>

        <HUD pos="t"><p>-------top center-------<br/>xxxxxxxxx</p></HUD>

        <HUD pos="tr"><p>top-right</p></HUD>
        <HUD pos="br"><p>bottom right</p></HUD>

        <Popups></Popups>
    </div>
</template>

<script>
    import HUD from "./HUD.vue";
    import Popups from "./Popups.vue";
    export default {
        name: "Application",
        components: {HUD, Popups}
    }
</script>

<style scoped>
    .app {
        width: 100%;
        height: 100%;
    }
</style>