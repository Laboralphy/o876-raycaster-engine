<template>
  <section class="generic-box">
    <div v-if="header !== '0'" class="header" :style="'height: ' + header">
      <slot name="header"></slot>
    </div>
    <div class="content" :style="'top: ' + header + '; bottom: ' + footer">
      <slot></slot>
    </div>
    <div v-if="footer !== '0'" class="footer" :style="'height: ' + footer">
      <slot name="footer"></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: "GenericBox",
  props: {
    header: {
      type: String,
      required: false,
      default: '0'
    },
    footer: {
      type: String,
      required: false,
      default: '0'
    }
  }
}
</script>

<style scoped>
section.generic-box {
  height: 100%;
  width: 100%;
}

section.generic-box > div {
  position: absolute;
  left: 0;
  right: 0;
}

section.generic-box > div.header {
  top: 0;
  overflow:hidden;
}

section.generic-box > div.content {
  overflow: auto;
}

section.generic-box > div.footer {
  bottom: 0;
  overflow:hidden;
}
</style>