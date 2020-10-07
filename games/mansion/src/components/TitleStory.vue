<template>
  <section class="game-story">
    <div class="ui-menu-window ui-size-50-90 rounded">
      <GenericBox
          footer="4em"
          header="6em"
      >
        <template v-slot:header>
          <div class="container">
            <h1>{{ STRINGS.GAME_STORY.title }}</h1>
            <hr/>
          </div>
        </template>
        <section class="content">
          <div class="container">
            <SmallListAndCaption
                :caption="getCurrentStoryPart.caption"
                :text="getCurrentStoryPart.text"
                :remark="getCurrentStoryPart.remark || ''"
            ></SmallListAndCaption>
          </div>
          <div v-if="getCurrentStoryPhoto !== ''" class="photo">
            <img :src="'assets/uigfx/intro/' + getCurrentStoryPhoto"/>
          </div>
        </section>
        <template v-slot:footer>
          <div class="container">
            <hr/>
            <div class="commands">
              <button @click="--phase">{{ STRINGS.GAME_STORY.commands.prev }}</button>
              <button @click="incPhase">{{ STRINGS.GAME_STORY.commands.next }}</button>
            </div>
          </div>
        </template>
      </GenericBox>
    </div>
  </section>

</template>

<script>
import STRINGS from './mixins/strings';
import UIMixin from './mixins/ui';

import SmallListAndCaption from "./SmallListAndCaption.vue";
import GenericBox from "./GenericBox.vue";

export default {
  name: "TitleStory",
  components: {GenericBox, SmallListAndCaption},
  mixins: [STRINGS, UIMixin],
  computed: {
    getLocalPhase: function() {
      return this.phase - this.getStoryData.startingPhase;
    },
    getCurrentStoryPart: function() {
      return this.STRINGS.GAME_STORY.pages[this.getLocalPhase];
    },
    getCurrentStoryPhoto: function() {
      return this.getStoryData.splashes[this.getLocalPhase];
    }
  },
  methods: {
    incPhase: function() {
      if (++this.phase >= 7) {
        // lancer le jeu
        this.$emit('startgame');
      }
    }
  }
}
</script>

<style scoped>

section.game-story {
  font-size: 0.8em;
  font-family: "KleponScone", Courier, monospace;
  font-weight: normal;
  color: rgb(52, 51, 50);
  text-align: left;
}

section.game-story h1 {
  font-size: 2em;
  font-weight: bolder;
}

.ui-menu-window {
  background: antiquewhite;
}

div.photo img {
  margin: auto;
  border: solid 0.2em black;
  width: 66%;
  box-shadow: 0.25em 0.25em 0.5em rgba(0, 0, 0, 0.3);
}

div.commands button {
  font-size: 1em;
  font-family: "KingthingsTrypewriter2", Courier, monospace;
}

div.container {
  padding-left: 1em;
  padding-right: 1em;
}

div.ui-menu-window {
  background-color: antiquewhite;
}

div.container h1 {
  margin-top: 0.2em;
  margin-bottom: 0.2em;
}

div.rounded {
  border-radius: 0.5em;
}

</style>
