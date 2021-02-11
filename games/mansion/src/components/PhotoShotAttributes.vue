<template>
    <div :class="'ui scores ' + (isShotVisible ? 'visible' : 'hidden')">
        <div class="value damage" v-if="isShotDamaging">{{ STRINGS.SHOT_DAMAGE }} {{ getShotScore }}pt{{ getShotScore > 1 ? 's' : '' }}</div>
        <div class="value" v-else>{{ STRINGS.SHOT_VALUE }} {{ getShotScore }}pt{{ getShotScore > 1 ? 's' : '' }}</div>
        <div class="fatal" v-if="isShotFatal">{{ STRINGS.SHOT_FATAL }}</div>
        <div v-if="isShotZero">{{ STRINGS.SHOT_ZERO }}</div>
        <div v-if="isShotCore">{{ STRINGS.SHOT_CORE }}</div>
        <div v-if="isShotClose">{{ STRINGS.SHOT_CLOSE }}</div>
        <div v-if="isShotDouble">{{ STRINGS.SHOT_DOUBLE }}</div>
        <div v-if="isShotTriple">{{ STRINGS.SHOT_TRIPLE }}</div>
        <div v-if="isShotMultiple">{{ STRINGS.SHOT_MULTIPLE }}</div>
    </div>

</template>

<script>
    import STRINGS from '../mixins/strings';
    import ui from "../mixins/ui";

    export default {
        name: "PhotoShotAttributes",
        mixins: [STRINGS, ui]
    }
</script>

<style scoped>
    .scores {
        margin-top: 1.5em;
        margin-left: 0.5em;
        font-size: 1.1em;
        color: white;
        text-shadow: #63b8ee 0 0 0.5em;
    }

    .value {
        font-size: 1.3em;
        font-weight: bold;
    }

    .damage {
      color: yellow;
      text-shadow: #ee9b63 0 0 0.5em;
    }

    .fatal {
        color: #FFDDDD;
        text-shadow: #ee524f 0 0 0.5em;
        font-weight: bold;
    }

    .scores.visible {
        visibility: visible;
        opacity: 1;
        transform: translateX(0);
        transition: transform 0.4s, visibility 0s, opacity 0.4s ease-in;
    }

    .scores.hidden {
        visibility: hidden;
        opacity: 0;
        transform: translateX(-5em);
        transition: transform 0.4s, visibility 0.4s, opacity 0.4s ease;
    }

</style>
