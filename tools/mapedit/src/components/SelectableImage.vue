<template>
    <img
        :class="getMainClass"
        :src="src"
        @click="toggleSelect"
        draggable="true"
        @dragstart="dragstartEvent"
    />
</template>

<script>
    export default {
        name: "SelectableImage",
        props: {
            src: String,
            tileId: Number
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
            },

            dragstartEvent: function(event) {
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text', this.tileId.toString());
            },
        }
    }
</script>

<style scoped>
    .tile {
        border: solid 0.4em #00C;
        margin: 0.3em;
        cursor: pointer;
        user-select: none;
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