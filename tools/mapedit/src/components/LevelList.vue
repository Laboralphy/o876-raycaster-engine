<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <Window
            caption="Open level"
    >
        <template v-slot:toolbar>
            <MyButton :disabled="!selectedLevel" @click="loadAndExit"><FolderOpenIcon decorative></FolderOpenIcon> Open</MyButton>
            <MyButton :disabled="!selectedLevel" @click="erase"><DeleteIcon decorative></DeleteIcon> Delete</MyButton> -
            <MyButton
                    :disabled="!selectedLevel"
                    @click="exportToGame"
                    title="exports the level and its textures into the game project asset directories"
            ><ArchiveIcon title="exports the level and its textures into the game project asset directories" decorative></ArchiveIcon> Export to game</MyButton>
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
    import * as FH from '../libraries/fetch-helper';
    import LevelThumbnail from "./LevelThumbnail.vue";
    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import FolderOpenIcon from "vue-material-design-icons/FolderOpen.vue";
    import DeleteIcon from "vue-material-design-icons/Delete.vue";
    import ArchiveIcon from "vue-material-design-icons/Archive.vue";

    const {mapGetters: editorMapGetters, mapActions: editorMapActions} = createNamespacedHelpers('editor');
    const {mapActions: levelMapActions} = createNamespacedHelpers('level');

    export default {
        name: "LevelList",
        components: {ArchiveIcon, DeleteIcon, FolderOpenIcon, MyButton, Window, LevelThumbnail},

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
                listLevels: EDITOR_ACTION.LIST_LEVELS,
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
                this.$router.push('/level/blocks');
            },

            onClick: function(name) {
                this.selectedLevel = name;
            },

            onDblClick: function(name) {
                this.onClick(name);
                this.loadAndExit(name);
            },

            erase: async function() {
                if (confirm('Do you want to delete this level : ' + this.selectedLevel + ' ? (this operation is definitive)')) {
                    await FH.deleteLevel(this.selectedLevel);
                    await this.setStatusBarText({text: 'Level delete : ' + name});
                    await this.listLevels();
                }
            },

            exportToGame: async function() {
                const result = await FH.exportLevel(this.selectedLevel);
                if (result.status === 'done') {
                    await this.setStatusBarText({text: 'Level successfully exported : ' + name});
                } else {
                    await this.setStatusBarText({text: 'Error while exporting level : ' + name + ' - ' + result.error});
                }
            }
        },

        mounted: function() {
            this.listLevels();
        }
    }
</script>

<style scoped>

</style>