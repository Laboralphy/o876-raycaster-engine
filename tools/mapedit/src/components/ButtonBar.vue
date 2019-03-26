<template>
    <div>
        <button
                v-for="b in commands"
                type="button"
                :key="b.id"
                :title="b.hint"
                @click="$emit('command', {id: b.id})"
        >
            {{b.caption}}
        </button>
    </div>
</template>

<script>
    export default {
        name: "ButtonBar",
        props: {
            commands: {
                type: Array,
                required: false,
                default: function() {
                    return [];
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