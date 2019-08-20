<template>
    <div class="popups">
        <Popup :visible="getPopup.visible" :icon="getPopup.icon" :text="getPopup.text"></Popup>
    </div>
</template>

<script>

    import {createNamespacedHelpers} from 'vuex';
    import Popup from "./Popup.vue";

    const {mapGetters: uiMapGetters} = createNamespacedHelpers('ui');

    export default {
        name: "Info",
        components: {Popup},
        computed: {
            ...uiMapGetters([
                'getPopup'
            ])
        }
    }

</script>

<style scoped>

</style>