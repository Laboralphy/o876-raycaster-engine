<template>
    <img
        :class="getMainClass"
        :src="src"
        @click="toggleSelect"
    />
</template>

<script>
    export default {
        name: "SelectableImage",
        props: {
            src: String
        },

        data: function() {
            return {
                selected: false
            }
        },

        computed: {
            getMainClass: function() {
                const aClasses = ['tile', 'r'];
                if (this.selected) {
                    aClasses.push('selected');
                }
                return aClasses.join(' ');
            }
        },

        methods: {
            toggleSelect: function() {
                this.selected = !this.selected;
                this.$emit('selected', {value: this.selected});
            }
        }
    }
</script>

<style scoped>
    .tile {
        border: solid 0.4em #00C;
        margin: 0.3em;
        cursor: pointer;
    }

    .tile:hover {
        border-color: #55F;
        filter: brightness(140%);
    }

    .tile.selected {
        border-color: limegreen;
        filter: brightness(120%);
    }

    .tile.selected:hover {
        border-color: #8F8;
        filter: brightness(140%);
    }
</style>