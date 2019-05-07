<template>
    <MyButton
            @click="onClick"
            :class="selected ? 'selected' : ''"
            :title="title"
    >
        <slot></slot>
    </MyButton>
</template>

<script>
    import MyButton from "./MyButton.vue";
    export default {
        name: "SiblingButton",
        components: {MyButton},
        props: {
            title: String,
            default: {
                type: Boolean,
                default: function() {
                    return false;
                },
                required: false
            }
        },
        data: function() {
            return {
                selected: this.default
            }
        },
        methods: {
            onClick: function() {
                this.$parent.selectSibling(this);
            },
        }
    }
</script>

<style scoped>
    .selected {
        filter: brightness(150%);
        color: #0000FF;
    }
</style>