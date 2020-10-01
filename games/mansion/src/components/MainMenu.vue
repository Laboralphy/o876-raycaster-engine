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
    <section v-else-if="phase === 1">
      <div class="ui-menu-window ui-size-50-75 rounded">
        <GenericBox
            footer="4em"
            header="6em"
        >
          <template v-slot:header>
            <div class="container">
              <h1>{{ STRINGS.HOWTO.title }}</h1>
              <hr/>
            </div>
          </template>
          <section class="content">
            <table>
              <tbody>
              <HowTo
                  v-for="(s, i) in STRINGS.HOWTO.actions"
                  :desc="s.desc"
                  :note="s.note || ''"
                  :image="howToImages[i]"
                  :key="'howto-' + i"
              ></HowTo>
              </tbody>
            </table>
          </section>
          <template v-slot:footer>
            <div class="container">
              <hr/>
              <div class="commands">
                <button @click="++phase">{{ STRINGS.GAME_STORY.commands.tostory }}</button>
              </div>
            </div>
          </template>
        </GenericBox>
      </div>
    </section>
    <GameStory v-else></GameStory>
  </section>
</template>
<script>
import UIMixin from './mixins/ui';
import STRINGS from './mixins/strings';
import GameStory from "./GameStory.vue";
import HowTo from "./HowTo.vue";
import GenericBox from "./GenericBox.vue";

export default {
  name: "MainMenu",
  components: {HowTo, GameStory, GenericBox},
  mixins: [STRINGS, UIMixin],
  data: function() {
    return {
      howToImages: [
        'assets/uigfx/input/kbd_zqsd_mouse.png',
        'assets/uigfx/input/kbd_esc.png',
        'assets/uigfx/input/mlb_layout.png',
        'assets/uigfx/input/mrb_layout.png'
      ]
    };
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
  color: rgb(220, 220, 220);
  text-align: left;
}

ul.options {
  list-style-type: none;
}

ul.options button {
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

.controls img {
  display: inline-block;
}

div.controls {
  font-family: "KingthingsTrypewriter2", Courier, monospace;
  padding: 1em;
  text-align: right;
}

div.commands button {
  font-size: 1.2em;
  font-family: "KingthingsTrypewriter2", Courier, monospace;
}
</style>