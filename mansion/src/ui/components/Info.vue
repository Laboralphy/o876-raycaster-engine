<template>
    <div class="popups">
        <Popup v-if="!!getFirstPopup" :icon="getFirstPopup.icon" :text="getFirstPopup.text"></Popup>
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
                'getFirstPopup'
            ])
        }
    }

</script>

<style scoped>

</style>