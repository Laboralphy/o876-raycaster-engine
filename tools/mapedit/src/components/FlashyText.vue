<template>
    <span :class="flashy ? 'flashy' : 'no-flashy'">{{ text }}</span>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex';
    import * as ACTION from '../store/modules/editor/action-types';


    const {mapActions: editorActions, mapGetters: editorGetters} = createNamespacedHelpers('editor');

    export default {
        name: "FlashyText",

        data: function() {
            return {
                flashy: true
            }
        },

        methods: {
            ...editorActions({
                setStatusBarText: [ACTION.SET_STATUSBAR_TEXT]
            }),
        },

        watch: {
            text: function (value) {
                this.flashy = false;
                setTimeout(() => this.flashy = true, 200);
            }
        },

        computed: {

            ...editorGetters([
                'getStatusBarText'
            ]),

            text: {
                set (value) {
                    this.setStatusBarText({text: value});
                },

                get () {
                    return this.getStatusBarText;
                }
            }
        }
    }
</script>

<style scoped>

    @keyframes flashy-animation {
        from {
            color: rgb(255, 255, 255);
        }

        to {
            color: rgb(0, 0, 0);
        }
    }

    span.flashy {
        font-weight: bolder;
        font-size: 1.05em;
        animation: flashy-animation 0.2s 3 alternate linear;
    }

    span.no-flashy {
        color: rgba(0, 0, 0, 0);
    }
</style>