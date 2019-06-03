<template>
    <a
            href="#"
            :title="title"
            :class="'myButton' + (disabled ? ' disabled' : ' enabled')"
            @click.stop="!disabled && $emit('click')"
    ><slot></slot></a>
</template>

<script>
    export default {
        name: "MyButton",
        props: {
            title: String,
            disabled: {
                type: Boolean,
                required: false,
                default: false
            }
        },
    }
</script>

<style scoped>
    .myButton {
        box-shadow:inset 0 0.1em 0 0 #bee2f9;
        /*background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #63b8ee), color-stop(1, #468ccf));*/
        /*background:-moz-linear-gradient(top, #63b8ee 5%, #468ccf 100%);*/
        /*background:-webkit-linear-gradient(top, #63b8ee 5%, #468ccf 100%);*/
        /*background:-o-linear-gradient(top, #63b8ee 5%, #468ccf 100%);*/
        /*background:-ms-linear-gradient(top, #63b8ee 5%, #468ccf 100%);*/
        background:linear-gradient(to bottom, #63b8ee 5%, #468ccf 100%);
        /*filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#63b8ee', endColorstr='#468ccf',GradientType=0);*/
        background-color:#63b8ee;
        border-radius:0.3em;
        border:0.1em solid #3866a3;
        display:inline-block;
        cursor:pointer;
        color:#14396a;
        font-family:Arial;
        font-size:1em;
        font-weight:bold;
        /*padding:0.4em 1em;*/
        padding:0.3em 0.5em;
        text-decoration:none;
        text-shadow:0 0.1em 0 #7cacde;
    }

    .myButton:focus {
        outline: 0;
        /*border-color: #EEE;*/
    }

    .myButton.enabled:hover {
        /*background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #468ccf), color-stop(1, #63b8ee));*/
        /*background:-moz-linear-gradient(top, #468ccf 5%, #63b8ee 100%);*/
        /*background:-webkit-linear-gradient(top, #468ccf 5%, #63b8ee 100%);*/
        /*background:-o-linear-gradient(top, #468ccf 5%, #63b8ee 100%);*/
        /*background:-ms-linear-gradient(top, #468ccf 5%, #63b8ee 100%);*/
        background:linear-gradient(to bottom, #468ccf 5%, #63b8ee 100%);
        /*filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#468ccf', endColorstr='#63b8ee',GradientType=0);*/
        background-color:#468ccf;
    }
    .myButton.enabled:active {
        position:relative;
        top:1px;
    }

    .myButton.disabled {
        box-shadow:inset 0 0.1em 0 0 #CCC;
        background:linear-gradient(to bottom, #999 5%, #777 100%);
        background-color:#777;
        color:#555;
        border:0.1em solid #555;
        text-shadow:0 0.1em 0 #999;
    }
</style>