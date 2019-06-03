<template>
    <div class="statusbar">
        <div class="border">
            <slot></slot>
        </div>
    </div>
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
        padding: 0.2em;
    }

    div.statusbar {
        margin-top: 0.1em;
        margin-bottom: 0.1em;
        padding-top: 0.2em;
        padding-bottom: 0.2em;
    }


</style>