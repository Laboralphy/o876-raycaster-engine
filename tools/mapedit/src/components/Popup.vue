<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="popup">
        <Window :caption="title">
            <div class="message">
                <slot></slot>
                <div v-if="type === 'progress'">
                    <progress style="width: 100%" max="1" :value="progress"></progress>
                </div>
            </div>
        </Window>
    </div>
</template>

<script>
    import Window from "./Window.vue";
    export default {
        name: "Popup",
        components: {Window},
        props: {
            title: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: false,
                default: "simple"
            },
            progress: {
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