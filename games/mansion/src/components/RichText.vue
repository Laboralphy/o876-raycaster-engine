<template>
  <section>
    <RichString
        v-for="(s, i) in text"
        :text="s"
        :key="'rs-' + i"
    ></RichString>
  </section>
</template>

<script>
import RichString from './RichString.vue';

export default {
  name: 'RichText',
  components: { RichString },
  props: {
    text: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
