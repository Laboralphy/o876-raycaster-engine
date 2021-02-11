<template>
  <p>
    <span
        v-for="(p, i) in getTokenizedText"
        :key="i"
        :class="'tokenized-string ' + p.tokens.join(' ')"
    >{{ p.text }}</span>
  </p>
</template>

<script>
import CurlyTokenizer from 'libs/curly-tokenizer';
const ct = new CurlyTokenizer()

export default {
  name: 'RichString',
  props: {
    text: {
      type: String,
      required: true
    }
  },
  computed: {
    getTokenizedText: function () {
      return ct.parse(this.text);
    }
  }
}
</script>

<style scoped>

</style>
