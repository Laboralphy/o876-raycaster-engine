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
import TitleStory from "./intro/TitleStory.vue";
import HowTo from "./HowTo.vue";
import GenericBox from "./GenericBox.vue";
import TitleMain from "./intro/TitleMain.vue";
import TitleControls from "./intro/TitleControls.vue";

export default {
  name: "MainMenu",
  components: {TitleControls, TitleMain, HowTo, TitleStory, GenericBox},
  mixins: [STRINGS, UIMixin]
}
</script>

<style scoped>

</style>