<template>
  <table>
    <tbody>
    <tr>
      <td>
        <MyButton @click="() => $emit('select', { direction: 'top-left' })"><ArrowTopLeftThickIcon decorative></ArrowTopLeftThickIcon></MyButton>
      </td>
      <td>
        <MyButton @click="() => $emit('select', { direction: 'top' })"><ArrowUpThickIcon decorative></ArrowUpThickIcon></MyButton>
      </td>
      <td>
        <MyButton @click="() => $emit('select', { direction: 'top-right' })"><ArrowTopRightThickIcon decorative></ArrowTopRightThickIcon></MyButton>
      </td>
    </tr>
    <tr>
      <td>
        <MyButton @click="() => $emit('select', { direction: 'left' })"><ArrowLeftThickIcon decorative></ArrowLeftThickIcon></MyButton>
      </td>
      <td>

      </td>
      <td>
        <MyButton @click="() => $emit('select', { direction: 'right' })"><ArrowRightThickIcon decorative></ArrowRightThickIcon></MyButton>
      </td>
    </tr>
    <tr>
      <td>
        <MyButton @click="() => $emit('select', { direction: 'bottom-left' })"><ArrowBottomLeftThickIcon decorative></ArrowBottomLeftThickIcon></MyButton>
      </td>
      <td>
        <MyButton @click="() => $emit('select', { direction: 'bottom' })"><ArrowDownThickIcon decorative></ArrowDownThickIcon></MyButton>
      </td>
      <td>
        <MyButton @click="() => $emit('select', { direction: 'bottom-right' })"><ArrowBottomRightThickIcon decorative></ArrowBottomRightThickIcon></MyButton>
      </td>
    </tr>
    </tbody>
  </table>

</template>

<script>
import ArrowTopLeftThickIcon from "vue-material-design-icons/ArrowTopLeftThick.vue";
import ArrowUpThickIcon from "vue-material-design-icons/ArrowUpThick.vue";
import ArrowTopRightThickIcon from "vue-material-design-icons/ArrowTopRightThick.vue";
import ArrowLeftThickIcon from "vue-material-design-icons/ArrowLeftThick.vue";
import ArrowRightThickIcon from "vue-material-design-icons/ArrowRightThick.vue";
import ArrowBottomLeftThickIcon from "vue-material-design-icons/ArrowBottomLeftThick.vue";
import ArrowDownThickIcon from "vue-material-design-icons/ArrowDownThick.vue";
import ArrowBottomRightThickIcon from "vue-material-design-icons/ArrowBottomRightThick.vue";
import MyButton from "./MyButton.vue";
export default {
name: "DirectionalPad",
  components: {
    MyButton,

    ArrowBottomRightThickIcon,
    ArrowDownThickIcon,
    ArrowBottomLeftThickIcon,
    ArrowRightThickIcon,
    ArrowLeftThickIcon,
    ArrowTopRightThickIcon,
    ArrowUpThickIcon,
    ArrowTopLeftThickIcon,
  }
}
</script>

<style scoped>

</style>