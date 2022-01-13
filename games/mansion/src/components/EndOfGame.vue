<template>
  <div class="ui-menu-window typewriter ui-size-50-50">
    <div class="end-of-game-caption">
      <p>
      Ceci est la fin de la partie jouable. Y'aura-t-il une suite ?
      </p>
    </div>
  </div>
</template>

<script>
import stringMixin from '../mixins/strings'

export default {
  name: "EndOfGame",
  mixins: [stringMixin]
}
</script>

<style scoped>
.ui-menu-window {
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 0.5em;
  box-shadow: 0 0 2em rgba(0, 0, 0, 0.7);
  padding-top: 2em;
}

.end-of-game-caption {
  color: var(--color-spirit);
  text-shadow: 0 0 0.2em var(--color-spirit);
  text-align: center;
}
</style>