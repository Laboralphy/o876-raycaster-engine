<template>
    <figure :class="'photo typewriter' + (big ? ' big' : '')" @click="$emit('click')">
        <img :class="gray ? 'gray' : 'color'" :src="content" alt="photo"/>
        <figcaption :title="caption">{{ caption }}</figcaption>
    </figure>
</template>

<script>
    export default {
        name: "Photo",

        props: {
            content: {
                type: String,
                required: true
            },
            caption: {
                type: String,
                required: false,
                default: ''
            },
            big: {
                type: Boolean,
                require: false,
                default: false
            },
            gray: {
                type: Boolean,
                require: false,
                default: false
            }
        },
    }
</script>

<style scoped>
    figure.photo {
        background-color: antiquewhite;
        padding: 1%;
        float: left;
        margin: 0.5%;
        width: 22%;
        box-shadow: rgba(0, 0, 0, 0.4) 0.2em 0.2em 0.2em;
        cursor: pointer;
        transition: filter 160ms linear;
    }

    figure.photo.big {
        width: 33%;
        margin-left: 2%;
        margin-right: 3%;
    }

    figure.photo:hover {
        filter: brightness(1.333);
    }

    figure.photo > img {
        width: 100%;
    }

    figure.photo > figcaption {
        font-size: 0.8em;
        color: black;
        height: 1.15em;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    figure.photo img.gray {
        filter: grayscale(30%) contrast(70%) sepia(70%);
    }
</style>