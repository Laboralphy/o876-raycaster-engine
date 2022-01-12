<template>
  <div class="ui-menu-window typewriter ui-size-50-50">
    <div class="game-over">
      Ecran fatidique
    </div>
    <div class="game-over-caption">
      ...de fin de programme.
      Ce jeu est inachevé.
    </div>
    <div class="restart" style="">
      <button >{{ STRINGS.GAME_OVER_BUTTON_CAPTION }}</button>
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
.game-over {
  color: var(--color-spirit);
  text-shadow: 0 0 1em var(--color-spirit);
  font-size: 400%;
  text-align: center;
  margin-top: 15%;
}

.game-over-caption {
  color: var(--color-spirit);
  text-shadow: 0 0 0.2em var(--color-spirit);
  text-align: center;
}

.restart {
  position: absolute;
  bottom: 0.35em;
  right: 0.35em;
}
</style>