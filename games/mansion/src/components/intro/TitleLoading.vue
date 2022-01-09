<template>
  <section>
    <div class="ui-menu-window ui-size-50-50 typewriter">
      <div class="loading">{{ STRINGS.LABEL_LOADING }}...</div>
    </div>
  </section>
</template>

<script>
import STRINGS from '../../mixins/strings';
import ui from '../../mixins/ui';

export default {
  name: "TitleLoading",
  mixins: [STRINGS, ui]
}
</script>

<style scoped>

@keyframes opacityPulse {
  from {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}

div.loading {
  font-size: 2em;
  font-weight: normal;
  color: rgb(220, 220, 220);
  text-align: center;

  animation-name: opacityPulse;
  animation-direction: alternate;
  animation-duration: 2s;
  animation-timing-function: ease;
}

</style>