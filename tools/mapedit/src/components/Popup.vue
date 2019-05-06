<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="popup">
        <Window>
            <template v-slot:toolbar>
                {{ title }}
            </template>
        </Window>
        <div class="message">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import Window from "./Window";
    export default {
        name: "Popup",
        components: {Window},
        props: {
            title: {
                type: String,
                required: true
            },
            type: {
                type: Number,
                required: false,
                default: 0
            }
        }
    }
</script>

<style scoped>
    div.popup {
        width: 480px;
        height: 240px;
        -moz-box-shadow: 0 0 32px 16px rgba(0, 0, 0, 0.6);
        -webkit-box-shadow: 0 0 32px 16px rgba(0, 0, 0, 0.6);
        -o-box-shadow: 0 0 32px 16px rgba(0, 0, 0, 0.6);
        box-shadow: 0 0 32px 16px rgba(0, 0, 0, 0.6);
        left: 50%;
        top: 50%;
        margin-left: -240px;
        margin-top: -120px;
        position: absolute;
    }

    div.popup > table.o876window {
        width: 100%;
        height: 100%;
        border-color: black;
    }

    div.popup div.message,
    div.popup.error div.message {
        margin: 16px;
        font-size: 125%;
    }

    div.popup.error > table.o876window h1 {
        background-color: #A00;
        border-color: #800;
    }

</style>