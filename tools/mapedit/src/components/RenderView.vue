<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Raycaster rendering"
    >
        <template v-slot:toolbar>
        </template>
        <div>
            <canvas ref="canvas" width="400" height="250"></canvas>
        </div>
    </Window>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex';
    import Window from "./Window.vue";
    import {generate} from '../libraries/generate';
    import Engine from "../../../../src/engine/Engine";

    let engine, controlThinker;

    function transmitKeyUpEvent(event) {
        controlThinker.keyUp(event.key);
    }

    function transmitKeydownEvent(event) {
        controlThinker.keyDown(event.key);
    }


    const {mapGetters: levelMapGetters} = createNamespacedHelpers('level');
    export default {
        name: "RenderView",
        components: {Window},

        computed: {
            ...levelMapGetters(['getLevel'])
        },

        methods: {

            run: async function(level, canvas) {
                const data = await generate(level);
                engine = new Engine();
                console.log(canvas);
                console.log(data);
                engine.setRenderingCanvas(canvas);
                await engine.buildLevel(data, (phase, progress) => {
                    console.log(phase, progress);
                });
                engine.startDoomLoop();
            }
        },

        mounted: function() {
            this.$nextTick(async function () {
                const level = this.getLevel;
                await this.run(level, this.$refs.canvas);
                // plugs keyboard events
                window.addEventListener('keydown', transmitKeydownEvent);
                window.addEventListener('keyup', transmitKeyUpEvent);
            });
        },

        beforeDestroy: function () {
            engine.stopDoomLoop();
            engine.
            window.removeEventListener('keydown', transmitKeydownEvent);
            window.removeEventListener('keyup', transmitKeyUpEvent);
        }
    }
</script>

<style scoped>
    canvas {
        margin-top: 2em;
        margin-left: 10%;
        width: 80%;
        box-shadow: 0 0 1em rgba(0, 0, 0, 0.5);
    }
</style>