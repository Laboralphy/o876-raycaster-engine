<template>
  <div class="typewriter score-section"><div class="label">{{ STRINGS.ATTR_SCORE.toUpperCase() }} :</div><div class="value">{{ getScoreString }}</div></div>
</template>

<script>
import logic from '../mixins/logic';
import album from '../mixins/album';
import strings from '../mixins/strings'

export default {
  name: 'ScoreSection',
  mixins: [album, logic, strings],
  computed: {
    getScoreString: function() {
      const nAlbumScore = this.getAlbumTotalScore;
      const nInventoryScore = this.getInventoryTotalValue;
      const nTotal = nAlbumScore + nInventoryScore;
      return nTotal.toString();
    }
  }
}
</script>

<style scoped>
.score-section {
  font-weight: bolder;
  color: aquamarine;
  text-shadow: 0 0 0.2em mediumaquamarine, 0 0 1em black;
  text-align: right;
  margin-right: 1em;
  margin-top: 1em;
}

.score-section .label {
  font-size: 0.75em;
  opacity: 0.6;
  font-style: italic;
}

.score-section .value {
  font-size: 2em;
}
</style>
