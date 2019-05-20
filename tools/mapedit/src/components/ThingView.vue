<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            :caption="getComputedCaption"
    >
        <template v-slot:toolbar>
            <MyButton hint="Remove this thing from the map">
                <DeleteIcon
                        hint="Remove this thing from the map"
                        decorative
                        @click="deleteClicked"
                ></DeleteIcon>
            </MyButton>
        </template>

        <Thing
                :content="getContent"
        ></Thing>
        <hr/>
        <h3>Actions :</h3>
    </Window>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex';
    import * as CONSTS from '../consts';
    import * as LEVEL_ACTION from '../store/modules/level/action-types';
    import * as EDITOR_MUTATION from '../store/modules/editor/mutation-types';
    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import PlusIcon from "vue-material-design-icons/Plus.vue";
    import PencilIcon from "vue-material-design-icons/Pencil.vue";
    import DeleteIcon from "vue-material-design-icons/Delete.vue";
    import Thing from "./Thing.vue";

    const {mapGetters: levelMapGetters, mapActions: levelMapActions} = createNamespacedHelpers('level');
    const {mapMutations: editorMapMutations, mapGetters: editorMapGetters} = createNamespacedHelpers('editor');

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

            ...levelMapGetters([
                'getThings',
                'getTiles',
                'getThing',
                'getSpriteTile',
                'getGrid'
            ]),


            ...editorMapGetters([
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
            ...levelMapActions({
                removeCellThing: LEVEL_ACTION.REMOVE_CELL_THING
            }),

            ...editorMapMutations({
                somethingHasChanged: EDITOR_MUTATION.SOMETHING_HAS_CHANGED
            }),

            importThing: function(newValue) {
                const {xc, yc, xt, yt} = newValue;
                const oThing = this.getGrid[yc][xc].things.find(t => t.x === xt && t.y === yt);
                console.log(newValue, oThing);
                if (!!oThing) {
                    console.log('thing', oThing);
                    const oThingTemplate = this.getThing(oThing.id);
                    const idTile = oThingTemplate.tile;
                    const oTile = this.getSpriteTile(idTile);
                    console.log('tile', idTile, oTile);
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