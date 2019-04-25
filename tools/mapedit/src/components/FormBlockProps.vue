<template>
    <form>
        <div>
            <label>Phys:
                <select v-model="mPhys" class="w13em">
                    <option v-for="p in getBlockBuilderPhysicalData" :key="p.id" :value="p.id">{{ p.label }}</option>
                </select>
            </label>
            <div class="hint">Block physical property</div>
        </div>
        <div>
            <label>Offs: <input v-model="mOffs" type="number" min="0" :max="getTileWidth"/></label>
            <div class="hint">Increasing this value creates an alcove, the higher value, the deeper.</div>
        </div>
        <div>
            <label>Light: <input v-model="mLight" type="checkbox"/></label>
        </div>
        <div>
            <div class="hint" v-show="!mLight">Check this on to open light properties panel</div>
            <fieldset v-show="mLight">
                <legend>Light source properties</legend>
                <div>
                    <label>Intensity: <input v-model="mLightValue" type="number" min="0" max="1" step="0.01"/></label>
                </div>
                <div>
                    <label>In.rad.: <input v-model="mLightInnerRadius" type="number" min="0"/></label>
                </div>
                <div>
                    <label>Out.rad.: <input v-model="mLightOuterRadius" type="number" min="0"/></label>
                </div>
            </fieldset>
        </div>
        <div>
            <label>Ref: <input style="width: 8em" v-model="mRef" type="text"/></label>
            <div class="hint">Optional symbolic identifier used during dev time</div>
        </div>
        <hr/>
        <div>
            <MyButton @click="$emit('submitCreate', getData)">Create</MyButton>
            <MyButton @click="$emit('submitUpdate', getData)">Update</MyButton>
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
                MUTATION.BLOCKBUILDER_SET_REF,
                MUTATION.BLOCKBUILDER_SET_PHYS,
                MUTATION.BLOCKBUILDER_SET_OFFS,
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
                'getBlockBuilderRef',
                'getBlockBuilderPhys',
                'getBlockBuilderOffs',
                'getBlockBuilderLight',
                'getBlockBuilderLightValue',
                'getBlockBuilderLightInnerRadius',
                'getBlockBuilderLightOuterRadius'
            ]),

            mRef: {
                get () {
                    return this.getBlockBuilderRef;
                },
                set (value) {
                    this[MUTATION.BLOCKBUILDER_SET_REF]({value});
                }
            },

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
                    ref: this.mRef,
                    phys: this.mPhys | 0,
                    offs: this.mOffs | 0,
                    light: {
                        enabled: !!this.mLight,
                        value: parseFloat(this.mLightValue),
                        inner: this.mLightInnerRadius | 0,
                        outer: this.mLightOuterRadius | 0
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

    .hint {
        font-family: Arial,sans-serif;
        font-style: italic;
        color: rgb(64, 64, 64);
    }

    .hint:before {
        content: "(";
    }

    .hint:after {
        content: ")";
    }

</style>