<template>
  <section class="description">
    <p v-for="s in text" v-html="s"></p>
  </section>
</template>

<script>
export default {
name: "Description",
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