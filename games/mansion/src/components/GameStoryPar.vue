<template>
  <div class="game-story-par">
    <div class="caption">{{ caption }}</div>
    <ul class="text">
      <li
          v-for="(t, i) in text"
          :key="'gsp-' + i"
      >
        {{ t }}
      </li>
    </ul>
    <div class="remark" v-if="remark !== ''">{{ remark }}</div>
    <div class="hint" v-if="hint !== ''">{{ hint }}</div>
  </div>
</template>

<script>
export default {
  name: "GameStoryPar",
  props: {
    text: {
      type: Array,
      required: true
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

ul.text > li {
  font-family: "KleponScone", sans-serif;
  color: black;
  font-size: 1.4em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.caption {
  font-family: "KleponScone", sans-serif;
  color: black;
  font-size: 1.4em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.remark {
  font-family: "KleponScone", sans-serif;
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