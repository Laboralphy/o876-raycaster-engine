<template>
    <div class="card">
        <div v-if="title.length > 0" class="row">
          <div class="col lg-12">
            <h2 :class="'title ' + color">{{ title }}</h2>
          </div>
        </div>
        <div class="row">
            <div class="col lg-12"><slot></slot></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Card",
        props: {
            title: {
                type: String,
                default: '',
                required: false
            },
            color: {
                type: String,
                default: '',
                required: false
            }
        }
    }
</script>

<style scoped>
</style>