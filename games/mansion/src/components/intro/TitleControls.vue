<template>
  <div class="ui-menu-window ui-size-50-75 rounded typewriter">
    <GenericBox
        footer="4em"
        header="6em"
    >
      <template v-slot:header>
        <div class="container">
          <h1>{{ STRINGS.HOWTO_TITLE }}</h1>
          <hr/>
        </div>
      </template>
      <section class="content">
        <table>
          <tbody>
          <HowTo
              v-for="(s, i) in STRINGS.HOWTO_ACTIONS"
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
            <button class="typewriter" @click="++phase">{{ STRINGS.COMMAND_CAPTION_START }}</button>
          </div>
        </div>
      </template>
    </GenericBox>
  </div>
</template>

<script>
import STRINGS from '../../mixins/strings';
import ui from '../../mixins/ui';
import GenericBox from "../GenericBox.vue";
import HowTo from "../HowTo.vue";

export default {
  name: "TitleControls",
  components: {HowTo, GenericBox},
  mixins: [STRINGS, ui],
  data: function () {
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

div.commands button {
  font-size: 1.2em;
}

</style>