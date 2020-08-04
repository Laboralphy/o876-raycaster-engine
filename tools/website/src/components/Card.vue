<template>
    <div class="card">
        <div class="row">
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
                default: 'no title',
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