<template>
  <div>
    <div class="seamless">
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
              :exported="l.published"
              :invault="l.invault"
              @unpublish="({name}) => unpublish(name)"
          ></LevelThumbnail>
        </div>
      </div>
      <div class="row">
        <div class="col lg-12">
          <h4>In vault levels</h4>
          <p>These levels can be edited via the Map editor, but are still unavailable for the Game Engine until they are
            published.
            To publish a level, click on "Publish" or use the Map Editor.</p>
          <p v-if="getUnpublishedLevels.length === 0" style="color: #800">Nothing to publish.</p>
          <LevelThumbnail
              v-for="l in getUnpublishedLevels"
              :key="l.name"
              :name="l.name"
              :date="l.date"
              :preview="l.preview"
              :exported="l.published"
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
import LevelThumbnail from "../LevelThumbnail.vue";
import {deleteJSON, fetchJSON, putJSON} from "libs/fetch-json";

import {createNamespacedHelpers} from 'vuex';

const {mapGetters: mainGetters} = createNamespacedHelpers('main');

export default {
  name: "HomePage",
  components: {LevelThumbnail},

  data: function () {
    return {
      levels: [],
      gameActionPrefix: 'game'
    }
  },

  computed: {

    getPublishedLevels: function () {
      return this.levels.filter(l => l.published);
    },

    getInVaultLevels: function () {
      return this.levels.filter(l => !l.published);
    },

    getUnpublishedLevels: function () {
      const pl = this.getPublishedLevels.map(l => l.name);
      return this.levels.filter(l => !l.published && pl.indexOf(l.name) < 0);
    },
  },

  methods: {
    unpublish: async function (name) {
      if (!this.getInVaultLevels.find(l => l.name === name)) {
        if (!confirm('This action will delete the level "' + name + '" permanently ; because there is no backup of this level in the Map Editor vault.')) {
          return;
        }
      }
      await deleteJSON('/publish/' + name);
      return this.fetchLevelData();
    },

    publish: async function (name) {
      await putJSON('/publish/' + name);
      return this.fetchLevelData();
    },

    fetchLevelData: async function () {
      const vaultLevels = (await fetchJSON('/vault')).map(({ name, date, preview }) => ({
        name,
        date,
        invault: true,
        preview
      }))
      const levels = (await fetchJSON('/publish')).map(({ name, date, preview }) => ({
        name,
        date,
        published: true,
        preview
      }))
      levels.forEach(l => l.invault = vaultLevels.find(l => l.name === name))
      vaultLevels.forEach(l => l.published = levels.find(l => l.name === name))
      this.levels.splice(0, this.levels.length, ...levels, ...vaultLevels);
    },

    runProject: function () {
      window.location.href = this.gameActionPrefix;
    }
  },
  mounted: function () {
    this.fetchLevelData()
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