<template>
    <div class="ui-components">

        <section v-if="isVisible">
            <HUD pos="tl">
                <Vitals></Vitals>
                <Scores></Scores>
            </HUD>
            <HUD pos="bl"><p>bottom left</p></HUD>

            <HUD pos="t"></HUD>

            <HUD pos="tr"><p>top-right</p></HUD>
            <HUD pos="br"><p>bottom right</p></HUD>
        </section>

        <Popups></Popups>
    </div>
</template>

<script>
    import HUD from "./HUD.vue";
    import Popups from "./Popups.vue";
    import Vitals from "./Vitals.vue";
    import {createNamespacedHelpers} from 'vuex';
    import Scores from "./Scores.vue";

    const {mapGetters: uiMapGetters} = createNamespacedHelpers('ui');

    export default {
        name: "Application",
        components: {Scores, Vitals, HUD, Popups},
        computed: {
            ...uiMapGetters([
                'isVisible',
                'isShotVisible'
            ])
        }

    }
</script>

<style scoped>
    .ui-components {
        width: 100%;
        height: 100%;
    }
</style>