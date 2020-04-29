<template>
    <section :class="getComputedClass">
        <Sidebar></Sidebar>
        <Album v-if="getUIActiveTab === 'album'"></Album>
        <DivDummy v-if="getUIActiveTab === 'inv'" title="inventory"></DivDummy>
        <DivDummy v-if="getUIActiveTab === 'notes'" title="Notes"></DivDummy>
    </section>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex';

    import Album from "./Album.vue";
    import Sidebar from "./Sidebar.vue";
    import DivDummy from "./DivDummy.vue";

    const {mapGetters: uiMapGetters} = createNamespacedHelpers('ui');

    export default {
        name: "UIFrame",
        components: {DivDummy, Sidebar, Album},
        data: function() {
            return {
                fadeState: 0
            };
        },
        computed: {
            ...uiMapGetters([
                'getUIActiveTab',
                'isUIFrameFadingOut'
            ]),
            getComputedClass: function() {
                return 'ui-frame opacity' + this.fadeState.toString();
            }
        },
        watch: {
            isUIFrameFadingOut: {
                handler: function(val, oldVal) {
                    this.fadeState = val ? 0 : 1;
                    console.log(this.fadeState);
                },
                immediate: true
            }
        }

    }
</script>

<style scoped>
    .ui-frame {
        transition-property: opacity;
        transition-duration: 300ms;
        transition-timing-function: linear;

        opacity: 0;
    }

    .ui-frame.opacity1 {
        opacity: 1;
    }

    .ui-frame.opacity0 {
        opacity: 0;
    }
</style>