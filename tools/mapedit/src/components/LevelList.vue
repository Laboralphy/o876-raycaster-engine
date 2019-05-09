<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Open level"
    >
        <template v-slot:toolbar>
            <MyButton :disabled="!selectedLevel" @click="loadAndExit"><FolderOpenIcon decorative></FolderOpenIcon> Open</MyButton>
            <MyButton :disabled="!selectedLevel" @click="deleteLevel"><DeleteIcon decorative></DeleteIcon> Delete</MyButton>
        </template>
        <div>
            <LevelThumbnail
                    v-for="l in getLevelList"
                    :key="l.name"
                    :name="l.name"
                    :date="l.date"
                    :preview="l.preview"
                    :selected="l.name === selectedLevel"
                    @click="() => onClick(l.name)"
                    @dblclick="() => onDblClick(l.name)"
            ></LevelThumbnail>
        </div>
    </Window>

</template>

<script>
    import {createNamespacedHelpers} from 'vuex';
    import * as EDITOR_ACTION from '../store/modules/editor/action-types';
    import * as LEVEL_ACTION from '../store/modules/level/action-types';
    import LevelThumbnail from "./LevelThumbnail.vue";
    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import FolderOpenIcon from "vue-material-design-icons/FolderOpen.vue";
    import DeleteIcon from "vue-material-design-icons/Delete.vue";

    const {mapGetters: editorMapGetters, mapActions: editorMapActions} = createNamespacedHelpers('editor');
    const {mapActions: levelMapActions} = createNamespacedHelpers('level');

    export default {
        name: "LevelList",
        components: {DeleteIcon, FolderOpenIcon, MyButton, Window, LevelThumbnail},

        data: function() {
            return {
                selectedLevel: null
            };
        },

        computed: {
            ...editorMapGetters([
                'getLevelList'
            ])
        },

        methods: {

            ...editorMapActions({
                listLevel: EDITOR_ACTION.LIST_LEVELS,
                setStatusBarText: EDITOR_ACTION.SET_STATUSBAR_TEXT,
                setLevelName: EDITOR_ACTION.SET_LEVEL_NAME
            }),

            ...levelMapActions({
                loadLevel: LEVEL_ACTION.LOAD_LEVEL
            }),

            loadAndExit: async function() {
                await this.loadLevel({name: this.selectedLevel});
                await this.setStatusBarText({text: 'Level successfully loaded : ' + name});
                await this.setLevelName({name: this.selectedLevel});
                this.$router.push('/');
            },

            onClick: function(name) {
                this.selectedLevel = name;
            },

            onDblClick: function(name) {
                this.onClick(name);
                this.loadAndExit(name);
            },

            deleteLevel: function() {
                alert('not yet implemented');
            }

        },

        mounted: function() {
            this.listLevel();
        }
    }
</script>

<style scoped>

</style>