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
    <section v-if="phase === 1">
      <div class="ui-menu-window ui-size-60-90">
        <p class="game-story fade-in" :style="'animation-delay: ' + (i * 3) + 's'" v-for="(s, i) in STRINGS.MAIN_MENU_PLOT_SUMMARY" :key="i">{{ s }}</p>
        <div>
          <button style="position: absolute; bottom: 0; right: 0;">Passer l'intro</button>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import STRINGS from './mixins/strings';

export default {
  name: "MainMenu",
  mixins: [STRINGS],
  data: function() {
    return {
      phase: 0
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

ul.options button{
  font-size: 1.2em;
  font-family: "KingthingsTrypewriter2", Courier, monospace;
}

.game-story {
  font-size: 1em;
  font-family: "KingthingsTrypewriter2", Courier, monospace;
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

</style>