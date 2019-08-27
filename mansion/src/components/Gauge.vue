<template>
    <div class="container ui regular-height" :style="'width: ' + width + unit">
        <div class="value" :style="'background-color: ' + color + '; width: ' + getBarWidth + '%'"></div>
    </div>
</template>

<script>
    export default {
        name: "Gauge",
        props: {
            width: {
                type: Number,
                required: true
            },
            unit: {
                type: String,
                required: false,
                default: 'em'
            },
            max: {
                type: Number,
                required: false,
                default: 100
            },
            value: {
                type: Number,
                required: false,
                default: 0
            },
            color: {
                type: String,
                require: false,
                default: '#AAA'
            }
        },

        computed: {
            getBarWidth: function() {
                return 100 * this.value / this.max;
            }
        }
    }
</script>

<style scoped>
    .container {
        display: inline-block;
        border: solid 0.1em rgba(128, 128, 128, 0.7);
        background-color: rgba(32, 32, 32, 0.5);
        margin: 0;
        padding: 0;
        border-radius: 0.2em;
        box-sizing: border-box;
    }

    .value {
        /*background-color: rgba(63, 165, 192, 0.8);*/
        height: 100%;
        margin: 0;
        padding: 0;
        border-radius: 0.05em;
        box-sizing: border-box;
        transition-property: width;
        transition-timing-function: ease;
        transition-duration: 0.5s;
    }
</style>