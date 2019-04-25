<template>
    <div class="block">
        <img
                :width="width"
                :height="height"
                :src="content"
                alt="block"
        />
    </div>
</template>

<script>
    export default {
        name: "Block",
        props: ['width', 'height', 'content']
    }
</script>

<style scoped>
    div.block img {
        display: inline-block;
        border: solid 0.4em #00C;
        margin: 0.3em;
        cursor: pointer;
        user-select: none;
    }
</style>