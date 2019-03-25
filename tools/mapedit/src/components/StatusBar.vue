<template>
    <div class="statusbar"><div class="border"><slot></slot></div></div>
</template>

<script>
    export default {
        name: "StatusBar"
    }
</script>

<style scoped>
    div.statusbar {
        font-family: monospace;
        font-size: 1em;
        background-color: #CCC;
        padding: 0.2em;
    }

    div.statusbar {
        border: inset 0.2em #999;
        margin-top: 0.2em;
        margin-bottom: 0.2em;
        padding-top: 0.2em;
        padding-bottom: 0.2em;
    }


</style>