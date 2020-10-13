<template>
  <section class="game-story">
    <div class="ui-menu-window ui-size-50-90 rounded">
      <GenericBox
          footer="4em"
          header="6em"
      >
        <template v-slot:header>
          <div class="container">
            <h1 class="manuscript">{{ STRINGS.INTRO_MAP_TITLE }}</h1>
            <hr/>
          </div>
        </template>
        <section class="content">
          <div class="photo">
            <img src="assets/uigfx/intro/intro-map-2.jpg"/>
          </div>
          <div class="container manuscript">
            <ul>
              <li
                  v-for="(s, i) in STRINGS.INTRO_MAP_TASKS"
                  :key="'intro-map-task-' + i"
              >{{ s }}</li>
            </ul>
          </div>
        </section>
        <template v-slot:footer>
          <div class="container typewriter">
            <hr/>
            <div class="commands">
              <button class="typewriter" @click="--phase">{{ STRINGS.COMMAND_CAPTION_PREV }}</button>
              <button class="typewriter" @click="++phase">{{ STRINGS.COMMAND_CAPTION_NEXT }}</button>
            </div>
          </div>
        </template>
      </GenericBox>
    </div>
  </section>

</template>

<script>
import STRINGS from '../mixins/strings';
import UIMixin from '../mixins/ui';

import GenericBox from "../GenericBox.vue";

export default {
  name: "TitleStory",
  components: {GenericBox},
  mixins: [STRINGS, UIMixin]
}
</script>

<style scoped>

section.game-story {
  font-size: 1.2em;
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
  width: 80%;
  box-shadow: 0.25em 0.25em 0.5em rgba(0, 0, 0, 0.3);
}

div.commands button {
  font-size: 1em;
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
