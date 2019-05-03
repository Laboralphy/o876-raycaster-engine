<template>
    <figure
            class="level-thumbnail"
            @click="$emit('click')"
    >
        <img
                :src="getSource"
        />
        <figcaption>{{ name }}</figcaption>
    </figure>
</template>

<script>
    export default {
        name: "LevelThumbnail",

        props: {
            name: {
                type: String,
                required: true
            },
            preview: {
                type: Boolean,
                required: false,
                default: false
            }
        },

        computed: {
            getSource: function() {
                return './assets/images/no-preview.png';
            }
        },
    }
</script>

<style scoped>
    figure.level-thumbnail {
        display: inline-block;
        border: outset #AAA 0.2em;
        border-radius: 0.3em;
        padding: 0.4em;
        background-color: #AAA;
        margin: 1.5em;
        cursor: pointer;
    }

    figure.level-thumbnail img {
        border: solid thin #000;
    }

    figure.level-thumbnail figcaption {
        font-style: italic;
    }

    figure.level-thumbnail:hover {
        filter: brightness(133%);
    }
</style>