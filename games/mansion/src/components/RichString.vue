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
span.tokenized-string.red {
  color: red;
}

span.tokenized-string.blue {
  color: blue;
}

span.tokenized-string.smooth {
  opacity: 0.5;
}

span.tokenized-string.b {
  font-weight: bold;
}

span.tokenized-string.i {
  font-style: italic;
}

span.tokenized-string.s {
  text-decoration: line-through;
}

span.tokenized-string.u {
  text-decoration: underline;
}

</style>
