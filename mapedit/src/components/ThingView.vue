<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            :caption="getComputedCaption"
    >
        <template v-slot:toolbar>
            <MyButton @click="deleteClicked" hint="Remove this thing from the map">
                <DeleteIcon
                        hint="Remove this thing from the map"
                        decorative
                ></DeleteIcon>
            </MyButton>
        </template>

        <Thing
                :content="getContent"
        ></Thing>
        <hr/>
    </Window>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex';
    import * as CONSTS from '../consts';
    import * as LEVEL_ACTIONS from '../store/modules/level/action-types';
    import * as EDITOR_MUTATIONS from '../store/modules/editor/mutation-types';
    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import PlusIcon from "vue-material-design-icons/Plus.vue";
    import PencilIcon from "vue-material-design-icons/Pencil.vue";
    import DeleteIcon from "vue-material-design-icons/Delete.vue";
    import Thing from "./Thing.vue";

    const {mapGetters: levelGetters, mapActions: levelActions} = createNamespacedHelpers('level');
    const {mapMutations: editorMutations, mapGetters: editorGetters} = createNamespacedHelpers('editor');

    export default {
        name: "ThingView",
        components: {Thing, DeleteIcon, PencilIcon, PlusIcon, MyButton, Window},

        data: function() {
            return {
                CONSTS,
                value: {
                    thing: null,
                    tile: null
                }
            };
        },

        computed: {

            ...levelGetters([
                'getThings',
                'getTiles',
                'getThing',
                'getSpriteTile',
                'getGrid'
            ]),


            ...editorGetters([
                'getLevelGridThingSelected'
            ]),

            getContent: function() {
                return !!this.value.tile ? this.value.tile.content : '';
            },

            getComputedCaption: function() {
                return 'Thing Viewer';
            }
        },

        watch: {
            getLevelGridThingSelected: {
                immediate: true,
                handler: function(newValue, oldValue) {
                    this.importThing(newValue);
                },
                deep: true
            }
        },

        methods: {
            ...levelActions({
                removeCellThing: LEVEL_ACTIONS.REMOVE_CELL_THING
            }),

            ...editorMutations({
                somethingHasChanged: EDITOR_MUTATIONS.SOMETHING_HAS_CHANGED
            }),

            importThing: function(newValue) {
                const {xc, yc, xt, yt} = newValue;
                if (xc < 0 || yc < 0 || xt < 0 || yt < 0) {
                    this.value.thing = null;
                    this.value.tile = null;
                    return;
                }
                const oThing = this.getGrid[yc][xc].things.find(t => t.x === xt && t.y === yt);
                if (!!oThing) {
                    const oThingTemplate = this.getThing(oThing.id);
                    const idTile = oThingTemplate.tile;
                    const oTile = this.getSpriteTile(idTile);
                    this.value.thing = oThing;
                    this.value.tile = oTile;
                }
            },

            deleteClicked: async function() {
                await this.removeCellThing(this.getLevelGridThingSelected);
                this.somethingHasChanged({value: true});
                this.$router.push('/level/things');
            }
        }
    }
</script>

<style scoped>

</style>