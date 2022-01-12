<template>
    <div class="ui-components" data-request-pointer-lock="">
        <section v-if="isHUDVisible">
            <HUD pos="tl">
                <Vitals></Vitals>
                <PhotoShotAttributes></PhotoShotAttributes>
            </HUD>
            <HUD pos="bl"><p></p></HUD>
            <HUD pos="t"></HUD>
            <HUD pos="tr"><ScoreSection></ScoreSection></HUD>
            <HUD pos="br"><p></p></HUD>
        </section>
        <GameOverPrompt v-if="isGameOverPromptVisible"></GameOverPrompt>
        <UIFrame v-else-if="isUIFrameVisible"></UIFrame>
        <MainMenu v-if="isMainMenuVisible"></MainMenu>
        <Popups></Popups>
    </div>
</template>

<script>
    import HUD from "./HUD.vue";
    import Popups from "./Popups.vue";
    import Vitals from "./Vitals.vue";
    import PhotoShotAttributes from "./PhotoShotAttributes.vue";
    import UIFrame from "./UIFrame.vue";
    import MainMenu from "./MainMenu.vue";
    import ui from "../mixins/ui";
    import ScoreSection from './ScoreSection.vue';
    import GameOverPrompt from './GameOverPrompt.vue';

    export default {
        name: "Application",
        components: {GameOverPrompt, MainMenu, UIFrame, PhotoShotAttributes, Vitals, HUD, Popups, ScoreSection},
        mixins: [ui]
    }
</script>

<style scoped>
    .ui-components {
        width: 100%;
        height: 100%;
    }
</style>
