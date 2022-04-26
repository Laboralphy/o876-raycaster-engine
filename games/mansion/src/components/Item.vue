<template>
  <div class="item" @click="$emit('click', {id})">
    <img class="icon" :src="'assets/icons/' + icon + '.png'">
    <span class="description" v-if="count > 1">{{ count }} x</span>
    <span class="description">{{ name }}</span>
  </div>
</template>

<script>
export default {
  name: "Item",
  props: {
    id: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: false,
      default: 1
    }
  }
}
</script>

<style scoped>

div.item {
  border: inset thin rgba(128, 128, 128, 0.5);
  padding: 0.3em;
  margin: 0.25em;
  background-color: rgba(128, 76, 0, 0.2);
}

div.item:hover {
  background-color: rgba(128, 76, 0, 0.4);
  cursor: pointer;
}

img.icon {
  display: initial;
  vertical-align: middle;
  width: 2em;
  height: 2em;
}

.description {
  font-size: 0.9em;
  color: black;
  font-family: "OldNewspaperTypes", Courier, monospace;
}

</style>