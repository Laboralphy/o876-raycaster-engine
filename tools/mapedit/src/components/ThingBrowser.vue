<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            :caption="getComputedCaption"
    >
        <template v-slot:toolbar>
            <MyButton title="Create a new thing template" @click="createClicked"><PlusIcon title="Create a new thing template" decorative></PlusIcon></MyButton>
            <MyButton :disabled="!selected" title="Modify the selected thing template" @click="modifyClicked"><PencilIcon title="Modify the selected thing template" decorative></PencilIcon></MyButton>
            <MyButton :disabled="!selected" title="Delete the selected thing template" @click="deleteClicked"><DeleteIcon title="Delete the selected thing template" decorative></DeleteIcon></MyButton>
        </template>

        <Thing
                v-for="t in getThingTiles"
                :key="t.id"
                :content="t.content"
                :selected="t.id === selected"
                @click="() => onClicked(t.id)"
        ></Thing>
    </Window>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex';
    import * as CONSTS from '../consts';
    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import PlusIcon from "vue-material-design-icons/Plus.vue";
    import PencilIcon from "vue-material-design-icons/Pencil.vue";
    import DeleteIcon from "vue-material-design-icons/Delete.vue";
    import Thing from "./Thing.vue";

    const {mapGetters: levelMapGetters} = createNamespacedHelpers('level');

    export default {
        name: "ThingBrowser",
        components: {Thing, DeleteIcon, PencilIcon, PlusIcon, MyButton, Window},

        data: function() {
            return {
                selected: null,
                CONSTS
            };
        },

        computed: {

            ...levelMapGetters([
                'getThings',
                'getTiles',
                'getSpriteTile'
            ]),

            getComputedCaption: function() {
                return 'Thing browser - (' + this.getThings.length + ' thing' + (this.getThings.length > 0 ? 's' : '') + ')';
            },

            getThingTiles: function() {
                return this.getThings.map(t => {
                    const tile = this.getSpriteTile(t.tile);
                    if (!tile) {
                        throw new Error('this thing references the tile #' + t.tile + ' which is undefined');
                    }
                    return {
                        content: tile.content,
                        id: t.id,
                        animation: tile.animation
                    };
                });
            }
        },

        methods: {
            createClicked: function() {
                this.$router.push('/build-thing/0');
            },

            modifyClicked: function() {
                this.$router.push('/build-thing/' + this.selected);
            },

            deleteClicked: function() {

            },

            handleDrop: function(id, idIncoming) {

            },

            onClicked: function(id) {
                if (this.selected === id) {
                    this.selected = null;
                    //this[MUTATION.BLOCKBROWSER_SET_SELECTED]({value: null});
                } else {
                    this.selected = id;
                    //this[MUTATION.BLOCKBROWSER_SET_SELECTED]({value: id});
                }
            },

            setTileSelection: function(id, value) {
                console.log(this.$refs.tiles.$children);
                this.$refs.tiles.$children.forEach(t => {
                    tile.selected = id === t.$props.tile;
                });
            }
        }
    }
</script>

<style scoped>

</style>