<template>
  <section>
    <section v-if="phase === 0">
      <div class="ui-menu-window ui-size-50-50">
        <div class="game-title">{{ STRINGS.GAME_TITLE }}</div>
        <div class="game-sub-title">{{ STRINGS.GAME_SUB_TITLE }}</div>
        <ul class="options">
          <li>
            <button @click="phase = 1">{{ STRINGS.MAIN_MENU_OPTION_START }}</button>
          </li>
        </ul>
      </div>
    </section>
    <section v-if="phase >= 1">
      <div class="letter ui-menu-window ui-size-60-90">
        <GameStoryPar
          :caption="STRINGS.GAME_STORY.title"
          :big="true"
        ></GameStoryPar>
        <GameStoryPar
          v-for="(s, i) in STRINGS.GAME_STORY.intro"
          :key="'game-story-intro-' + i"
          :caption="s"
        ></GameStoryPar>
        <hr/>
        <GameStoryPar
            :caption="phase + '/4 : ' + getCurrentStoryPart.caption"
            :remark="getCurrentStoryPart.remark || ''"
            :hint="getCurrentStoryPart.hint || ''"
        ></GameStoryPar>
        <div class="photo">
          <img :src="'assets/uigfx/intro/' + splashes[phase - 1]"/>
        </div>
        <hr/>
        <div style="position: absolute; bottom: 2em; right: 2em">
          <button class="game-story-command" @click="--phase">{{ STRINGS.GAME_STORY.commands.prev }}</button>
          <button class="game-story-command" @click="++phase">{{ STRINGS.GAME_STORY.commands.next }}</button>
        </div>
      </div>
    </section>
  </section>
</template>
<script>
import STRINGS from './mixins/strings';
import GameStoryPar from "./GameStoryPar.vue";

export default {
  name: "MainMenu",
  components: {GameStoryPar},
  mixins: [STRINGS],
  data: function() {
    return {
      phase: 0,
      splashes: [
          'intro-village.jpg',
          'intro-paintings.jpg',
          'intro-books.jpg',
          'intro-cult.jpg'
      ]
    }
  },
  computed: {
    getCurrentStoryPart: function() {
      return this.STRINGS.GAME_STORY.objectives[this.phase - 1];
    }
  }

}
</script>

<style scoped>
div.game-title {
  font-size: 3em;
  font-family: "KingthingsTrypewriter2", Courier, monospace;
  font-weight: bolder;
  color: white;
  text-shadow: 0 0 0.5em #63b8ee;
  text-align: left;
}

div.game-sub-title {
  font-size: 1em;
  font-family: "KingthingsTrypewriter2", Courier, monospace;
  font-weight: normal;
  color: rgba(220, 220, 220);
  text-align: left;
}

ul.options {
  list-style-type: none;
}

ul.options button, button.game-story-command {
  font-size: 1.2em;
  font-family: "KingthingsTrypewriter2", Courier, monospace;
}

.game-story {
  font-size: 1em;
  font-family: "Notethis", Courier, monospace;
  font-weight: normal;
  color: rgb(200, 200, 200);
  text-align: left;
}

@keyframes kf-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation-duration: 500ms;
  animation-timing-function: linear;
  animation-direction: normal;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
  animation-name: kf-fade-in;
  opacity: 0;
}

.letter {
  background-color: antiquewhite;
  padding-left: 1.5em;
  padding-right: 1.5em;
}

div.photo img {
  margin: auto;
  border: solid 0.2em black;
}

</style>