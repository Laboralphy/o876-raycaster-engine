<template>
    <figure class="photo">
        <img :src="content" alt="photo"/>
        <figcaption>{{ caption }}</figcaption>
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
        width: 30%;
    }

    figure.photo > img {
        width: 100%;
    }

    figure.photo > figcaption {
        font-family: "KingthingsTrypewriter2", monospace;
        font-size: 1em;
        color: black;
    }
</style>