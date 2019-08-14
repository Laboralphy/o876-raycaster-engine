<template>
    <div class="popup">
        <div class="section icon" v-if="icon !== ''"><img alt="missing popup icon" :src="icon" /></div>
        <div class="section message">
            <p class="message">{{ text }}</p>
        </div>
    </div>
</template>

<script>

    export default {
        name: "Popup",
        props: {
            icon: {
                type: String,
                required: false,
                default: ''
            },
            text: {
                type: String,
                required: true
            }
        }
    }
</script>

<style scoped>

    div.popup {
        position: absolute;
        left: 25%;
        top: 15%;
        width: 50%;
        background-color: rgba(179, 158, 107, 0.8);
        border: solid 0.5em rgba(64, 12, 0, 0.8);
        border-radius: 15%;
    }

    div.section {
        display: inline-block;
    }

    div.popup p.message {
        color: rgba(48, 6, 0, 1);
        text-shadow: black 0.1em 0.1em 0.3em;
    }

</style>