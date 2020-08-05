<template>
    <div :class="getComputedClass">
        <img
                :width="width"
                :height="height"
                :src="content"
                alt="block"
                @click="$emit('click')"
        />
    </div>
</template>

<script>
    export default {
        name: "Block",
        props: ['width', 'height', 'content', 'selected'],

        computed: {
            getComputedClass: function() {
                let a = ['block'];
                if (this.selected) {
                    a.push('selected');
                }
                return a.join(' ');
            }
        }
    }
</script>

<style scoped>
    div.block {
        display: inline-block;
        user-select: none;
    }

    div.block img {
        cursor: pointer;
        border: solid 0.4em #00C;
        margin: 0.3em;
        user-select: none;
    }

    div.block.selected img {
        border-color: lime;
    }
</style>