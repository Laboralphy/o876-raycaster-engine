<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "Siblings",

        methods: {
            selectSibling: function(s) {
                this.selectSiblingIndex(this.$children.indexOf(s));
            },

            selectSiblingIndex: function(n) {
                this.$children.forEach((c, i) => {
                    c.selected = i === n;
                });
                this.$emit('input', {index: n});
            },

            selectAnotherSibling: function() {
                const oNewSelectedSibling = this.$children.filter((c, i) => !c.$props.disabled).shift();
                if (!!oNewSelectedSibling) {
                    this.selectSibling(oNewSelectedSibling);
                }
            }
        }
    }
</script>

<style scoped>
    div {
        display: inline;
        margin: 0;
        padding: 0;
    }
</style>