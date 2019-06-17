<template>
    <div>
        <div class="row">
            <div class="col lg-12">
                <h3>Local project status</h3>
                <p>Welcome to your local game project management page.</p>
                <h4>Published levels</h4>
                <p>These levels have been published from the Map Editor. They can be load in the Raycaster Game Engine.
                If you modify one of these level via the Map Editor, you'll have to publish it again.</p>
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
</template>

<script>
    import LevelThumbnail from "./LevelThumbnail.vue";
    import {deleteJSON, fetchJSON} from "../../../../lib/src/fetch-json";

    export default {
        name: "HomePage",
        components: {LevelThumbnail},
        data: function() {
            return {
                levels: []
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
                await deleteJSON('/game/level/' + name);
                await this.fetchLevelData();
            },

            publish: async function(name) {
                await fetchJSON('/export/' + name);
                await this.fetchLevelData();
            },

            fetchLevelData: function() {
                fetchJSON('/game/levels').then(data => {
                    this.levels.splice(0, this.levels.length, ...data);
                });
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