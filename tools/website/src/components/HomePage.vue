<template>
    <div>
        <div class="seamless" v-if="onlineVersion">
            <div class="row">
                <div class="col lg-12">
                    <h3>Raycasting Game Engine Home Page</h3>
                    <p>
                        This version of the O876 Raycasting Game Engine is hosted online.
                    </p>
                    <ul>
                        <li>Click on the "Map Editor" tab to run the map editor software and create your own
                            raycasting game maps.</li>
                        <li>The "Docs" map will give you insights of what raycasting technology is.</li>
                        <li>The "Demos" tab will direct you to a set of small demos using this game engine</li>
                    </ul>
                    <h4>For game developers</h4>
                    <p>
                        Visit the Project GitHub Repository located at :
                        <a href="https://github.com/Laboralphy/o876-raycaster-engine">https://github.com/Laboralphy/o876-raycaster-engine</a>.
                    </p>
                </div>
            </div>
        </div>
        <div class="seamless" v-else>
            <div class="row">
                <div class="col lg-12">
                    <h3>Local project status</h3>
                    <p>Welcome to your local game project management page.</p>
                    <nav v-if="getPublishedLevels.length > 0">
                        <ul>
                            <li>
                                <button class="green" @click="runProject()">Run your game project</button>
                            </li>
                        </ul>
                    </nav>
                    <nav v-else>
                        <ul>
                            <li>
                                <button class="disabled">Run your game project</button>
                            </li>
                            <li style="padding-left: 1em">
                                <span class="note">(The game project need at list one published level)</span>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div class="row">
                <div class="col lg-12">
                    <h4>Published levels</h4>
                    <p>These levels have been published from the Map Editor. They can be loaded in the Raycaster Game Engine.
                    If you modify one of these levels via the Map Editor, you'll have to publish it again.</p>
                    <p v-if="getPublishedLevels.length === 0" style="color: #800">No published level.</p>
                    <!-- lists of level that are currently present -->
                    <LevelThumbnail
                            v-for="l in getPublishedLevels"
                            :key="l.name"
                            :name="l.name"
                            :date="l.date"
                            :preview="l.preview"
                            :exported="l.exported"
                            :invault="l.invault"
                            @unpublish="({name}) => unpublish(name)"
                    ></LevelThumbnail>
                </div>
            </div>
            <div class="row">
                <div class="col lg-12">
                    <h4>In vault levels</h4>
                    <p>These levels can be edited via the Map editor, but are still unavailable for the Game Engine until they are published.
                    To publish a level, click on "Publish" or use the Map Editor.</p>
                    <p v-if="getUnpublishedLevels.length === 0" style="color: #800">Nothing to publish.</p>
                    <LevelThumbnail
                            v-for="l in getUnpublishedLevels"
                            :key="l.name"
                            :name="l.name"
                            :date="l.date"
                            :preview="l.preview"
                            :exported="l.exported"
                            :invault="l.invault"
                            :publishable="true"
                            @publish="({name}) => publish(name)"
                    ></LevelThumbnail>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import LevelThumbnail from "./LevelThumbnail.vue";
    import {deleteJSON, fetchJSON} from "../../../../libs/fetch-json";
    import CONFIG from "../../../service/config";

    export default {
        name: "HomePage",
        components: {LevelThumbnail},
        data: function() {
            return {
                levels: [],
                gameActionPrefix: 'game',
                onlineVersion: true
            }
        },

        computed: {
            getPublishedLevels: function() {
                return this.levels.filter(l => l.exported);
            },

            getInVaultLevels: function() {
                return this.levels.filter(l => !l.exported);
            },

            getUnpublishedLevels: function() {
                const pl = this.getPublishedLevels.map(l => l.name);
                return this.levels.filter(l => !l.exported && pl.indexOf(l.name) < 0);
            },
        },

        methods: {
            unpublish: async function(name) {
                const aStr = [];
                if (!this.getInVaultLevels.find(l => l.name === name)) {
                    if (!confirm('This action will delete the level "' + name + '" permanently ; because there is no backup of this level in the Map Editor vault.')) {
                        return;
                    }
                }
                await deleteJSON(this.gameActionPrefix + '/level/' + name);
                return this.fetchLevelData();
            },

            publish: async function(name) {
                await fetchJSON('/export/' + name);
                return this.fetchLevelData();
            },

            fetchLevelData: function() {
                return fetchJSON(this.gameActionPrefix + '/levels').then(data => {
                    this.levels.splice(0, this.levels.length, ...data);
                });
            },

            runProject: function() {
                window.location.href = this.gameActionPrefix;
            }
        },

        mounted: function() {
            this.fetchLevelData();
        }
    }
</script>

<style scoped>
    figure.logo {
        display: inline-block;
        height: 10em;
        width: 10em;
    }

    figure.logo figcaption {
        text-align: center;
    }
</style>