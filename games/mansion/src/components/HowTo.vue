<template>
  <tr>
    <td class="type-control">
      <div>
        <img :src="image" />
      </div>
    </td>
    <td class="description typewriter">
      <div>{{ desc }}</div>
      <div v-if="note !== ''" class="note">{{ note }}</div>
    </td>
  </tr>
</template>

<script>
export default {
  name: "HowTo",
  props: {
    image: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    note: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>

<style scoped>

.type-control div {
  padding: 1em;
  text-align: right;
}

.type-control div img {
  display: inline-block;
}

.description .note {
  font-style: italic;
  font-size: 0.8em;
  color: #999;
}

.description .note:before {
  content: "(";
}

.description .note:after {
  content: ")";
}
</style>