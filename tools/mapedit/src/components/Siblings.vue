<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "Siblings",
        data: function() {
            return {

            };
        }
    }
</script>

<style scoped>
    div {
        display: inline;
        margin: 0;
        padding: 0;
    }
</style>