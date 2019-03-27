<template>
    <span :class="'mdi mdi-' + code"></span>
</template>

<script>
    export default {
        name: "Mdi",
        props: {
            code: String,
            spin: Boolean,
            rotate: Number,
            outline: Boolean,
            vflip: Boolean,
            hflip: Boolean
        },

        computed: {
            getMainClass: function() {
                const a = [
                    'mdi',
                    'mdi-',
                ];
                if (this.outline) {
                    a.push('-outline');
                }
                if (!!this.rotate) {
                    a.push('mdi-rotate-' + this.rotate);
                }
                if (!!this.vflip) {
                    a.push('mdi-flip-v');
                }
                if (!!this.hflip) {
                    a.push('mdi-flip-h');
                }
                return a.join(' ');
            }
        }
    }
</script>

<style scoped>

</style>