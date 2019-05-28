<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Raycaster rendering"
    >
        <template v-slot:toolbar>
        </template>
        <div>
            <canvas :class="getFlagSmooth ? '' : 'no-smooth'" ref="canvas" width="400" height="250"></canvas>
        </div>
    </Window>
</template>

<script>
    import * as LEVEL_ACTION from '../store/modules/level/action-types';
    import {createNamespacedHelpers} from 'vuex';
    import Window from "./Window.vue";
    import {generate} from '../libraries/generate';
    import Engine from "../../../../src/engine/Engine";

    let engine = null;

    function transmitKeyUpEvent(event) {
        engine.camera.thinker.keyUp(event.key);
    }

    function transmitKeydownEvent(event) {
        engine.camera.thinker.keyDown(event.key);
    }


    const {mapGetters: levelMapGetters, mapActions: levelMapActions} = createNamespacedHelpers('level');
    export default {
        name: "RenderView",
        components: {Window},

        computed: {
            ...levelMapGetters(['getLevel', 'getFlagSmooth']),
        },

        methods: {
            ...levelMapActions({
                setPreview: LEVEL_ACTION.SET_PREVIEW
            }),
            run: async function(level, canvas) {
                const context = canvas.getContext('2d');
                try {
                    context.font = '16px monospace';
                    context.textBaseline = 'top';
                    context.fillStyle = 'black';
                    context.fillRect(0, 0, canvas.width, canvas.height);
                    context.fillStyle = 'rgb(0, 33, 128)';
                    const w = canvas.width * 0.8 | 0;
                    const h = 16;
                    const x = (canvas.width - w) >> 1;
                    const y = (canvas.height - h) >> 1;
                    context.fillRect(x, y, w, h);
                    context.fillStyle = 'white';
                    context.fillText('generating data', x, y - h);
                    const data = await generate(level);
                    engine = new Engine();
                    engine.setRenderingCanvas(canvas);
                    const grad = context.createLinearGradient(x, y, x, y + h);
                    grad.addColorStop(0, 'rgba(0, 66, 240)');
                    grad.addColorStop(0.5, 'rgba(20, 120, 250)');
                    grad.addColorStop(1, 'rgba(0, 66, 240)');
                    context.fillStyle = grad;
                    await engine.buildLevel(data, (phase, progress) => {
                        context.fillStyle = 'black';
                        context.fillRect(x, y - h, w, h);
                        context.fillStyle = 'white';
                        context.fillText(phase, x, y - h);
                        context.fillStyle = grad;
                        context.fillRect(x, y, progress * w | 0, h);
                    });
                    setTimeout(() => !!engine && engine.startDoomLoop(), 200);
                } catch (e) {
                    engine = null;
                    context.fillStyle = 'black';
                    context.fillRect(0, 0, canvas.width, canvas.height);
                    context.font = '12px monospace';
                    context.textBaseline = 'top';
                    context.fillStyle = 'white';
                    context.fillText('Could not render level', 8, 8);
                    context.fillStyle = 'red';
                    context.fillText(e.message, 8, 24);
                }
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
            if (!!engine) {
                const canvas = this.$refs.canvas;
                this.setPreview({value: engine.raycaster.screenshot(
                    canvas.width >> 1,
                    canvas.height >> 1,
                    'image/jpeg'
                )});
                engine.stopDoomLoop();
                window.removeEventListener('keydown', transmitKeydownEvent);
                window.removeEventListener('keyup', transmitKeyUpEvent);
                engine = null;
            }
        }
    }
</script>

<style scoped>
    .progress {
        padding-top: 12em;
        padding-left: 20%;
        width: 60%;
    }

    canvas {
        margin-top: 2em;
        margin-left: 10%;
        width: 80%;
        box-shadow: 0 0 1em rgba(0, 0, 0, 0.5);
    }

    canvas.no-smooth {
        image-rendering: optimizeSpeed;
    }
</style>