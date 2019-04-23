<template>
    <form>
        <div>
            <label>Phys:
                <select v-model="mPhys" class="w13em">
                    <option v-for="p in getBlockBuilderPhysicalData" :key="p.id" :value="p.id">{{ p.label }}</option>
                </select>
            </label>
        </div>
        <div>
            <label>Offs: <input v-model="mOffs" type="number" min="0" :max="getTileWidth"/></label>
        </div>
        <div>
            <label>Anim: <input v-model="mAnim" type="checkbox"/></label>
        </div>
        <div>
            <fieldset v-show="mAnim">
                <legend>Animation properties</legend>
                <div>
                    <label>Frames: <input v-model="mAnimFrames" type="number" min="1"/></label>
                </div>
                <div>
                    <label>Duration: <input v-model="mAnimDuration" type="number" min="0"/></label>
                </div>
                <div>
                    <label>
                        Loop:
                        <select v-model="mAnimLoop" class="w8em">
                            <option v-for="p in getBlockBuilderAnimLoopData" :key="p.id" :value="p.id">{{ p.label }}</option>
                        </select>
                    </label>
                </div>
            </fieldset>
        </div>
        <div>
            <label>Light: <input v-model="mLight" type="checkbox"/></label>
        </div>
        <div>
            <fieldset v-show="mLight">
                <legend>Light source properties</legend>
                <div>
                    <label>Value: <input v-model="mLightValue" type="number" min="0" max="1" step="0.01"/></label>
                </div>
                <div>
                    <label>In.rad.: <input v-model="mLightInnerRadius" type="number" min="0"/></label>
                </div>
                <div>
                    <label>Out.rad.: <input v-model="mLightOuterRadius" type="number" min="0"/></label>
                </div>
            </fieldset>
        </div>
        <hr/>
        <div>
            <MyButton @click="$emit('submit', getData)">Construire</MyButton>
        </div>
    </form>
</template>

<script>
    import * as MUTATION from '../store/modules/editor/mutation-types';
    import {createNamespacedHelpers} from'vuex';
    import MyButton from "./MyButton.vue";

    const {mapGetters: levelMapGetter, mapActions: levelMapActions} = createNamespacedHelpers('level');
    const {mapGetters: editorMapGetter, mapMutations: editorMapMutations} = createNamespacedHelpers('editor');

    export default {
        name: "FormBlockProps",
        components: {MyButton},

        data: function() {
            return {
            }
        },

        methods: {
            ...editorMapMutations([
                MUTATION.BLOCKBUILDER_SET_PHYS,
                MUTATION.BLOCKBUILDER_SET_OFFS,
                MUTATION.BLOCKBUILDER_SET_ANIM,
                MUTATION.BLOCKBUILDER_SET_ANIM_FRAMES,
                MUTATION.BLOCKBUILDER_SET_ANIM_DURATION,
                MUTATION.BLOCKBUILDER_SET_ANIM_LOOP,
                MUTATION.BLOCKBUILDER_SET_LIGHT,
                MUTATION.BLOCKBUILDER_SET_LIGHT_VALUE,
                MUTATION.BLOCKBUILDER_SET_LIGHT_INNER_RADIUS,
                MUTATION.BLOCKBUILDER_SET_LIGHT_OUTER_RADIUS,
            ])
        },

        computed: {
            ...levelMapGetter([
                'getTileHeight',
                'getTileWidth'
            ]),

            ...editorMapGetter([
                'getBlockBuilderPhysicalData',
                'getBlockBuilderAnimLoopData',
                'getBlockBuilderPhys',
                'getBlockBuilderOffs',
                'getBlockBuilderAnim',
                'getBlockBuilderAnimFrames',
                'getBlockBuilderAnimDuration',
                'getBlockBuilderAnimLoop',
                'getBlockBuilderLight',
                'getBlockBuilderLightValue',
                'getBlockBuilderLightInnerRadius',
                'getBlockBuilderLightOuterRadius'
            ]),

            mPhys: {
                get () {
                    return this.getBlockBuilderPhys;
                },
                set (value) {
                    this[MUTATION.BLOCKBUILDER_SET_PHYS]({value});
                }
            },

            mOffs: {
                get () {
                    return this.getBlockBuilderOffs;
                },
                set (value) {
                    this[MUTATION.BLOCKBUILDER_SET_OFFS]({value});
                }
            },

            mAnim: {
                get () {
                    return this.getBlockBuilderAnim;
                },
                set (value) {
                    this[MUTATION.BLOCKBUILDER_SET_ANIM]({value});
                }
            },

            mAnimFrames: {
                get () {
                    return this.getBlockBuilderAnimFrames;
                },
                set (value) {
                    this[MUTATION.BLOCKBUILDER_SET_ANIM_FRAMES]({value});
                }
            },

            mAnimDuration: {
                get () {
                    return this.getBlockBuilderAnimDuration;
                },
                set (value) {
                    this[MUTATION.BLOCKBUILDER_SET_ANIM_DURATION]({value});
                }
            },

            mAnimLoop: {
                get () {
                    return this.getBlockBuilderAnimLoop;
                },
                set (value) {
                    this[MUTATION.BLOCKBUILDER_SET_ANIM_LOOP]({value});
                }
            },

            mLight: {
                get () {
                    return this.getBlockBuilderLight;
                },
                set (value) {
                    this[MUTATION.BLOCKBUILDER_SET_LIGHT]({value});
                }
            },

            mLightValue: {
                get () {
                    return this.getBlockBuilderLightValue;
                },
                set (value) {
                    this[MUTATION.BLOCKBUILDER_SET_LIGHT_VALUE]({value});
                }
            },

            mLightInnerRadius: {
                get () {
                    return this.getBlockBuilderLightInnerRadius;
                },
                set (value) {
                    this[MUTATION.BLOCKBUILDER_SET_LIGHT_INNER_RADIUS]({value});
                }
            },

            mLightOuterRadius: {
                get () {
                    return this.getBlockBuilderLightOuterRadius;
                },
                set (value) {
                    this[MUTATION.BLOCKBUILDER_SET_LIGHT_OUTER_RADIUS]({value});
                }
            },



            getData: function() {
                return {
                    phys: parseInt(this.mPhys),
                    offs: parseInt(this.mOffs),
                    anim: {
                        enabled: this.mAnim,
                        count: parseInt(this.mAnimFrames),
                        duration: parseInt(this.mAnimDuration),
                        loop: parseInt(this.mAnimLoop)
                    },
                    light: {
                        enabled: this.mLight,
                        value: parseFloat(this.mLightValue),
                        inner: parseInt(this.mLightInnerRadius),
                        outer: parseInt(this.mLightOuterRadius)
                    }
                }
            }
        }
    }
</script>

<style scoped>

    input[type="number"] {
        width: 5em;
    }

    select.w13em {
        width: 13em;
    }

    select.w8em {
        width: 8em;
    }

</style>