<template>
    <MyButton
            @click="onClick"
            :class="selected ? 'selected' : ''"
            :hint="hint"
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
            hint: String,
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
                let iFound = -1;
                this.$parent.$children.forEach((c, i) => {
                    const selected = c === this;
                    if (selected) {
                        iFound = i
                    }
                    c.selected = selected;
                });
                this.$parent.$emit('select', {index: iFound});
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