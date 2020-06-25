<template>
    <table class="title-and-co">
        <tbody>
            <tr>
                <th class="title">
                    <div class="ui-window-title">{{ title }}</div>
                </th>
                <td class="co">
                    <slot></slot>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    export default {
        name: "TitleAndCo",

        props: {
            title: {
                type: String,
                required: true
            }
        }
    }
</script>

<style scoped>
    table.title-and-co,
    table.title-and-co > tbody,
    table.title-and-co > tbody > tr {
        margin: 0;
        padding: 0;
    }

    table.title-and-co > tbody > tr > td {
        margin: 0;
        padding: 0;
    }

    table.title-and-co > tbody > tr > th {
        margin: 0;
        padding: 0.2em;
        padding-left: 0.5em;
    }
</style>