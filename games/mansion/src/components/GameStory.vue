<template>
  <section class="game-story">
    <div class="ui-menu-window ui-size-60-90">
      <h1>{{ STRINGS.GAME_STORY.title }}</h1>
      <hr/>
      <GameStoryPar
          :caption="getCurrentStoryPart.caption"
          :text="getCurrentStoryPart.text"
          :remark="getCurrentStoryPart.remark || ''"
          :hint="getCurrentStoryPart.hint || ''"
      ></GameStoryPar>
      <div v-if="getCurrentStoryPhoto !== ''" class="photo">
        <img :src="'assets/uigfx/intro/' + getCurrentStoryPhoto"/>
      </div>
      <hr/>
      <div class="commands">
        <button @click="--phase">{{ STRINGS.GAME_STORY.commands.prev }}</button>
        <button @click="++phase">{{ STRINGS.GAME_STORY.commands.next }}</button>
      </div>
    </div>
  </section>

</template>

<script>
import STRINGS from './mixins/strings';
import UIMixin from './mixins/ui';

import GameStoryPar from "./GameStoryPar.vue";


export default {
  name: "GameStory",
  components: {GameStoryPar},
  mixins: [STRINGS, UIMixin],
  data: function() {
    return {
      splashes: [
        '',
        'intro-village.jpg',
        'intro-paintings.jpg',
        'intro-books.jpg',
        'intro-cult.jpg'
      ]
    }
  },
  computed: {
    getCurrentStoryPart: function() {
      return this.STRINGS.GAME_STORY.pages[this.phase - 1];
    },
    getCurrentStoryPhoto: function() {
      return this.splashes[this.phase - 1];
    }
  }
}
</script>

<style scoped>
section.game-story {
  font-size: 1em;
  font-family: "KleponScone", Courier, monospace;
  font-weight: normal;
  color: rgb(20, 20, 20);
  text-align: left;
}

section.game-story h1 {
  font-size: 2em;
  font-weight: bolder;
}

.ui-menu-window {
  background-color: antiquewhite;
  padding-left: 1.5em;
  padding-right: 1.5em;
}

div.photo img {
  margin: auto;
  border: solid 0.2em black;
  width: 50%;
}

div.commands {
  position: absolute;
  bottom: 1.5em;
  right: 2em;
}

div.commands button {
  font-size: 1.2em;
  font-family: "KingthingsTrypewriter2", Courier, monospace;
}
</style>