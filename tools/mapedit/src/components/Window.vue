<template>
    <table class="o876structure o876window">
        <tbody>
        <tr class="titlebar">
            <td><div><h1>{{ caption }}</h1></div></td>
        </tr>
        <tr class="toolbar">
            <td><div>
                <button
                    v-for="b in commands"
                    :key="b.id"
                    @click="$emit('command', {id: b.id})"
                >
                    {{b.caption}}
                </button>
            </div></td>
        </tr>
        <tr class="body floatingHeight">
            <td>
                <div class="body">
                    <slot></slot>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</template>

<script>
    export default {
        name: "Window",

        props: {
            caption: String,
            commands: Array
        }
    }
</script>

<style scoped>
    table.o876window {
        box-sizing: border-box;
        background-color: #DDD;
        border: solid 0.3em #666;
        padding: 0.3em;
        margin: 0;
        font-family: monospace;
        font-size: 1em;
    }

    table.o876window .toolbar button {
        font-size: 1em;
        height: 2.4em;
    }

    table.o876window h1 {
        font-size: 1.3em;
        font-family: monospace;
        background-color: #00F;
        color: white;
        border: solid 0.15em #00A;
        padding: 0.15em 0.15em 0.15em 0.6em;
        margin-top: 0;
        margin-bottom: 0.15em;
    }

    table.o876window span.label {
        font-family: monospace;
        font-size: 0.9em;
    }

    table.o876window .toolbar > td > div {
        background-color: #AAA;
        border: solid thin #666;
    }

    table.o876window td {
        vertical-align: top;
        margin: 0;
    }

    table.o876window .toolbar button.selected {
        color: #07F;
        text-shadow: 0.1em 0.1em 0.1em #FFF;
    }
</style>