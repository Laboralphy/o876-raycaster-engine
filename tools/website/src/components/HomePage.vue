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
                        v-for="l in getPublishedLevel"
                        :key="l.name"
                        :name="l.name"
                        :date="l.date"
                        :preview="'/vault/' + l.name + '.jpg'"
                        :exported="l.exported"
                ></LevelThumbnail>
            </div>
        </div>
        <div class="row">
            <div class="col lg-12">
                <h4>Unpublished levels</h4>
                <p>These levels can be edited via the Map editor, but are still unavailable for the Game Engine until they are published.
                To publish a level, go to the Map Editor, load a level, check the flag "auto-publish" on and save the level.</p>
                <LevelThumbnail
                        v-for="l in getUnpublishedLevel"
                        :key="l.name"
                        :name="l.name"
                        :date="l.date"
                        :preview="'/vault/' + l.name + '.jpg'"
                        :exported="l.exported"
                ></LevelThumbnail>
            </div>
        </div>
    </div>
</template>

<script>
    import LevelThumbnail from "./LevelThumbnail.vue";
    export default {
        name: "HomePage",
        components: {LevelThumbnail},
        data: function() {
            return {
                levels: [
                    {
                        name: 'test-dal',
                        preview: "/vault/test-dal.jpg",
                        date: Date.now(),
                        exported: true
                    },
                    {
                        name: 'test-dal-2',
                        preview: "/vault/test-dal.jpg",
                        date: Date.now(),
                        exported: false
                    }
                ]
            }
        },

        computed: {
            getPublishedLevel: function() {
                return this.levels.filter(l => l.exported);
            },

            getUnpublishedLevel: function() {
                return this.levels.filter(l => !l.exported);
            }
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