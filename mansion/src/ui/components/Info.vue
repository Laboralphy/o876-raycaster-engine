<template>
    <div class="popups">
        <Popup :visible="getPopup.visible" :icon="getPopup.icon" :text="getPopup.text"></Popup>
    </div>
</template>

<script>

    import {mapGetters} from 'vuex';
    import Popup from "./Popup.vue";

    export default {
        name: "Info",
        components: {Popup},
        computed: {
            ...mapGetters([
                'getPopup'
            ])
        }
    }

</script>

<style scoped>

</style>