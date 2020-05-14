<template>
    <div class="ui-menu-window ui-size-60-90">
        <TitleAndCo :title="title"></TitleAndCo>
    </div>
</template>

<script>
    import TitleAndCo from "./TitleAndCo.vue";
    export default {
        name: "DivDummy",
        components: {TitleAndCo},
        props: {
            title: {
                type: String,
                required: true
            }
        }
    }
</script>

<style scoped>

</style>