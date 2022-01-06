<template>
    <div :class="'pos ' + pos"><slot></slot></div>
</template>

<script>
    export default {
        name: "HUD",

        props: {
            pos: {
                type: String,
                required: true
            }
        }
    }
</script>

<style scoped>
    .pos {
        position: absolute;
    }

    .pos.tl {
        left: 0;
        top: 0;
    }

    .pos.tr {
        right: 0;
        top: 0;
    }

    .pos.br {
        right: 0;
        bottom: 0;
    }

    .pos.bl {
        left: 0;
        bottom: 0;
    }

    .pos.t {
        width: 100%;
        top: 0;
    }

    .pos.t > * {
        margin: auto;
        width: 50%;
    }

    .pos.l {
        left: 0;
        height: 50vh;
        margin-top: -25vh;
        top: 50vh;
    }

    .pos.r {
        right: 0;
        top: 50%;
    }



</style>