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
                    title="Publishes the level and its textures into the game project asset directories"
            ><PublishIcon title="Publishes the level and its textures into the game project asset directories" decorative></PublishIcon> Publish</MyButton>
        </template>
        <div>
            <LevelThumbnail
                    v-for="l in getLevelList"
                    :key="l.name"
                    :name="l.name"
                    :date="l.date"
                    :preview="'/vault/' + l.name + '.jpg'"
                    :selected="l.name === selectedLevel"
                    @click="() => onClick(l.name)"
                    @dblclick="() => onDblClick(l.name)"
            ></LevelThumbnail>
        </div>
    </Window>

</template>

<script>
    import {createNamespacedHelpers} from 'vuex';
    import * as EDITOR_ACTIONS from '../store/modules/editor/action-types';
    import * as LEVEL_ACTIONS from '../store/modules/level/action-types';
    import * as FH from '../libs/fetch-helper';
    import LevelThumbnail from "./LevelThumbnail.vue";
    import Window from "./Window.vue";
    import MyButton from "./MyButton.vue";
    import FolderOpenIcon from "vue-material-design-icons/FolderOpen.vue";
    import DeleteIcon from "vue-material-design-icons/Delete.vue";
    import PublishIcon from "vue-material-design-icons/Publish.vue";

    const {mapGetters: editorGetters, mapActions: editorActions} = createNamespacedHelpers('editor');
    const {mapActions: levelActions} = createNamespacedHelpers('level');

    export default {
        name: "LevelList",
        components: {PublishIcon, DeleteIcon, FolderOpenIcon, MyButton, Window, LevelThumbnail},

        data: function() {
            return {
                selectedLevel: null
            };
        },

        computed: {
            ...editorGetters([
                'getLevelList'
            ])
        },

        methods: {

            ...editorActions({
                listLevels: EDITOR_ACTIONS.LIST_LEVELS,
                setStatusBarText: EDITOR_ACTIONS.SET_STATUSBAR_TEXT,
                setLevelName: EDITOR_ACTIONS.SET_LEVEL_NAME
            }),

            ...levelActions({
                loadLevel: LEVEL_ACTIONS.LOAD_LEVEL
            }),

            loadAndExit: async function() {
                const name = this.selectedLevel;
                await this.loadLevel({name});
                await this.setStatusBarText({text: 'Level successfully loaded : ' + name});
                await this.setLevelName({name});
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
                const name = this.selectedLevel;
                if (confirm('Do you want to delete this level : ' + name + ' ? (this operation is definitive)')) {
                    await FH.deleteLevel(name);
                    await this.setStatusBarText({text: 'Level delete : ' + name});
                    await this.listLevels();
                }
            },

            exportToGame: async function() {
                try {
                  await FH.exportLevel(this.selectedLevel);
                  await this.setStatusBarText({text: 'Level published : ' + this.selectedLevel});
                } catch (e) {
                  await this.setStatusBarText({text: 'Error while publishing level : ' + this.selectedLevel});
                  alert('This function is available only in local development context.')
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