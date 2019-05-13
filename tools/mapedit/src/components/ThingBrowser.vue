<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Thing browser"
    >
        <template v-slot:toolbar>
            <MyButton title="Create a new thing template" @click="createClicked"><PlusIcon title="Create a new thing template" decorative></PlusIcon></MyButton>
            <MyButton :disabled="!selected" title="Modify the selected thing template" @click="modifyClicked"><PencilIcon title="Modify the selected thing template" decorative></PencilIcon></MyButton>
            <MyButton :disabled="!selected" title="Delete the selected thing template" @click="deleteClicked"><DeleteIcon title="Delete the selected thing template" decorative></DeleteIcon></MyButton>
        </template>

    </Window>
</template>

<script>
    import * as ACTION from '../store/modules/level/action-types';
    import * as MUTATION from '../store/modules/editor/mutation-types';
    import {createNamespacedHelpers} from 'vuex';
    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import PlusIcon from "vue-material-design-icons/Plus.vue";
    import PencilIcon from "vue-material-design-icons/Pencil.vue";
    import DeleteIcon from "vue-material-design-icons/Delete.vue";
    export default {
        name: "ThingBrowser",
        components: {DeleteIcon, PencilIcon, PlusIcon, MyButton, Window},

        data: function() {
            return {
                selected: null
            };
        },

        methods: {
            createClicked: function() {
                this.$router.push('/build-thing/0');
            },

            modifyClicked: function() {
                this.$router.push('/build-thing/' + this.selected);
            },

            deleteClicked: function() {

            }
        }
    }
</script>

<style scoped>

</style>