<template>
    <div class="popups">
        <Popup :visible="getPopup.visible" :icon="getPopup.icon" :text="getPopup.text"></Popup>
    </div>
</template>

<script>

    import Popup from "./Popup.vue";
    import ui from "../mixins/ui";

    export default {
        name: "Popups",
        components: {Popup},
        mixins: [ui]
    }

</script>

<style scoped>

</style>