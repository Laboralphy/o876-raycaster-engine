<template>
    <div :class="getComputedClass" @click="$emit('click')" align="center">
        <img
                :height="96"
                :src="content"
                alt="thing"
        />
    </div>
</template>

<script>
    export default {
        name: "Thing",
        props: ['width', 'height', 'content', 'selected'],

        computed: {
            getComputedClass: function() {
                let a = ['thing'];
                if (this.selected) {
                    a.push('selected');
                }
                return a.join(' ');
            }
        }
    }
</script>

<style scoped>
    div.thing {
        display: inline-block;
        user-select: none;
        border: solid 0.4em #00C;
        min-width: 64px;
        cursor: pointer;
        margin: 0.3em;
    }

    div.thing:hover {
        border-color: #55F;
        filter: brightness(140%);
    }

    div.thing.selected {
        border-color: lime;
        filter: brightness(120%);
    }

    div.thing.selected:hover {
        border-color: #8F8;
        filter: brightness(140%);
    }

    div.thing img {
        user-select: none;
        max-height: 96px;
    }
</style>