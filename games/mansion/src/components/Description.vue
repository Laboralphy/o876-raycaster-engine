<template>
  <RichText class="description" :text="text"></RichText>
</template>

<script>
import RichText from "./RichText.vue";
export default {
name: "Description",
  components: {RichText},
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