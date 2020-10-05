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
  </div>
</template>

<script>
export default {
  name: "SmallListAndCaption",
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
    }
  }
}
</script>

<style scoped>

ul.text > li {
  font-family: "KleponScone", sans-serif;
  font-size: 1.4em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.caption {
  font-family: "KleponScone", sans-serif;
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


</style>