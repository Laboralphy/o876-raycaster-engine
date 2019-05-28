<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Animation builder"
    >
        <template v-slot:toolbar>
            <ImageLoader
                    hint="Import a sky background image"
                    @load="skyImageLoaded"
            ><FolderImageIcon title="Import a sky background image"></FolderImageIcon> Load sky</ImageLoader>
        </template>
        <h3>Loaded sky image :</h3>
        <div class="image-restrain"><img
                class="bg-sky"
                :src="value.sky"
                alt="background image not loaded yet"
        /></div>
        <hr/>
        <h3>Fog and light parameters :</h3>
        <form>
            <div>
                <label>Fog color : <input v-model="value.fog.color" type="color" /></label>
                <div class="hint">Surface and sprite will be painted with this color if they are located further than the fog distance.</div>
            </div>
            <div>
                <label>Fog distance : <input v-model="value.fog.distance" type="number" min="0"/></label>
                <div class="hint">The distance at which the fog is totally opaque.</div>
            </div>
            <div>
                <label>Ambiant brightness : <input v-model="value.brightness" type="number" min="0" max="100" step="10"/>%</label>
                <div class="hint">Walls and flats can emit their own light. Value goes from 0% (no light emitted) to 100% (fog is dissipated)</div>
            </div>
            <div>
                <label>Enabled color filter ? <input v-model="value.filter.enabled" type="checkbox"/></label>
                <div class="hint">Check this on to enable sprite color filter</div>
            </div>
            <fieldset v-if="value.filter.enabled">
                <legend>
                    Color filter
                </legend>
                <div>
                    <label>filter value : <input v-model="value.filter.color" type="color"/></label>
                    <div class="hint">Sprites wand other background objects will be tinted with this color.</div>
                </div>
            </fieldset>
            <hr />
            <MyButton @click="applyClicked">Apply</MyButton>
        </form>
    </Window>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex';
    import * as LEVEL_ACTION from '../store/modules/level/action-types';

    import Window from "./Window.vue";
    import ImageLoader from "./ImageLoader.vue";
    import FolderImageIcon from "vue-material-design-icons/FolderImage.vue";
    import MyButton from "./MyButton.vue";

    const {mapGetters: levelMapGetters, mapActions: levelMapActions} = createNamespacedHelpers('level');

    export default {
        name: "AmbianceSetup",
        components: {MyButton, FolderImageIcon, ImageLoader, Window},

        data: function() {
            return {
                sky: '',
                value: {
                    sky: '',
                    fog: {
                        distance: 50,
                        color: 'black'
                    },
                    filter: {
                        enabled: false,
                        color: '#888'
                    },
                    brightness: 0
                }
            }
        },

        computed: {
            ...levelMapGetters(['getAmbiance'])
        },

        methods: {

            ...levelMapActions({
                setupAmbiance: LEVEL_ACTION.SETUP_AMBIANCE
            }),

            skyImageLoaded: function(event) {
                this.value.sky = event.data;
            },

            applyClicked: function() {
                this.setupAmbiance(this.value);
                this.$router.push('/level/blocks');
            }
        },

        mounted: function() {
            this.value = this.getAmbiance;
        }
    }
</script>

<style scoped>
    div.image-restrain img {
        max-height: 30em;
    }

    img.bg-sky {
        border: solid 4px black;
    }
</style>