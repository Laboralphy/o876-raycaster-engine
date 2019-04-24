<template>
    <MyButton
            hint="Return to the main page"
            @click="goHome"
    ><HomeIcon></HomeIcon></MyButton>
</template>

<script>
    import MyButton from "./MyButton.vue";
    import * as EMOJI from '../libraries/emoji';
    import HomeIcon from "vue-material-design-icons/Home.vue";
    export default {
        name: "HomeButton",
        components: {HomeIcon, MyButton},
        data: function() {
            return {
                caption: EMOJI.HOUSE_BUILDING
            };
        },
        methods: {
            goHome: function() {
                this.$router.push('/');
            }
        }
    }
</script>

<style scoped>

</style>