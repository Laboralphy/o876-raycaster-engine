<template>
  <section>
    <div class="ui-menu-window ui-size-50-50 typewriter">
      <div class="game-title">{{ STRINGS.GAME_TITLE }}</div>
      <div class="game-sub-title">{{ STRINGS.GAME_SUB_TITLE }}</div>
      <ul class="options">
        <li>
          <button @click="phase = 1">{{ STRINGS.MAIN_MENU_OPTION_START }}</button>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import STRINGS from '../mixins/strings';
import ui from '../mixins/ui';

export default {
  name: "TitleMain",
  mixins: [STRINGS, ui]
}
</script>

<style scoped>

div.game-title {
  font-size: 3em;
  font-weight: bolder;
  color: white;
  text-shadow: 0 0 0.5em #63b8ee;
  text-align: left;
}

div.game-sub-title {
  font-size: 1em;
  font-weight: normal;
  color: rgb(220, 220, 220);
  text-align: left;
}

ul.options {
  list-style-type: none;
}

ul.options button {
  font-size: 1.2em;
}

</style>