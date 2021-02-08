<template>
    <div class="vitals">
        <div class="ui row axial">
            <div class="label"><span>{{ STRINGS.ATTR_HITPOINTS }}</span></div>
            <Gauge :width="10" color="rgb(96, 220, 255)" :max="getPlayerAttributeHPMax" :value="getPlayerAttributeHP"></Gauge>
        </div>
    </div>
</template>

<script>
    import Gauge from "./Gauge.vue";
    import STRINGS from '../mixins/strings';
    import ui from "../mixins/ui";

    export default {
        name: "Vitals",
        components: {Gauge},
        mixins: [STRINGS, ui]
    }
</script>

<style scoped>
    .vitals {
        margin: 0.3em;
        padding: 0.3em;
    }
    .label {
        color: #AAAAAA;
        text-shadow: black 1px 1px 0;
        font-size: 0.6em;
        display: inline-block;
        padding-right: 0.4em;
        padding-left: 0.2em;
    }
</style>