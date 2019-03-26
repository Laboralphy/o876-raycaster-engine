<template>
    <div :class="getMainClass">
        <Window
                :caption="caption"
        >
            <slot></slot>
        </Window>
    </div>
</template>

<script>
    import Window from "./Window.vue";
    export default {
        name: "Popup",
        components: {Window},
        props: {
            caption: String,
            error: Boolean
        },
        computed: {
            getMainClass: function() {
                const aClasses = ['popup'];
                if (this.error) {
                    aClasses.push('error')
                }
                return aClasses.join(' ');
            }
        }
    }
</script>

<style scoped>

    div.popup {
        width: 480px;
        height: 240px;
        -moz-box-shadow: 0px 0px 32px 16px rgba(0, 0, 0, 0.6);
        -webkit-box-shadow: 0px 0px 32px 16px rgba(0, 0, 0, 0.6);
        -o-box-shadow: 0px 0px 32px 16px rgba(0, 0, 0, 0.6);
        box-shadow: 0px 0px 32px 16px rgba(0, 0, 0, 0.6);
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