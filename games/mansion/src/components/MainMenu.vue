<template>
  <section>
    <TitleMain v-if="phase === 0"></TitleMain>
    <TitleControls v-else-if="phase === 1"></TitleControls>
    <TitleStory v-else-if="phase > 1 && phase < 7"></TitleStory>
  </section>
</template>
<script>
import UIMixin from './mixins/ui';
import STRINGS from './mixins/strings';
import TitleStory from "./TitleStory.vue";
import HowTo from "./HowTo.vue";
import GenericBox from "./GenericBox.vue";
import TitleMain from "./TitleMain.vue";
import TitleControls from "./TitleControls.vue";

export default {
  name: "MainMenu",
  components: {TitleControls, TitleMain, HowTo, TitleStory, GenericBox},
  mixins: [STRINGS, UIMixin]
}
</script>

<style scoped>


div.commands button {
  font-size: 1.2em;
  font-family: "KingthingsTrypewriter2", Courier, monospace;
}
</style>