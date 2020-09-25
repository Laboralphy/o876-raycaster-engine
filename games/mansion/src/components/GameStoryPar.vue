<template>
  <div :class="'game-story-par ' + (big ? 'big' : 'not-big')">
    <div class="caption">{{ caption }}</div>
    <div class="remark" v-if="remark !== ''">{{ remark }}</div>
    <div class="hint" v-if="hint !== ''">{{ hint }}</div>
  </div>
</template>

<script>
export default {
  name: "GameStoryPar",
  props: {
    big: {
      type: Boolean,
      required: false,
      default: false
    },
    caption: {
      type: String,
      required: true
    },
    remark: {
      type: String,
      required: false,
      default: ''
    },
    hint: {
      type: String,
      required: false,
      default: ''
    },
  }
}
</script>

<style scoped>

.big {
  font-size: 1.8em;
  font-weight: bold;
}


.caption {
  font-family: "HyningsHandwritingV2-Regular", Courier, monospace;
  color: black;
  font-size: 1.4em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.remark {
  font-family: "HyningsHandwritingV2-Regular", Courier, monospace;
  color: #444444;
  font-size: 1.2em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  margin-left: 2em;
}

.hint {
  font-family: "Courier New", Courier, monospace;
  color: darkblue;
  font-size: 0.7em;
  font-style: italic;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  margin-left: 2em;
}


</style>