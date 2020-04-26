<template>
    <div>
        <div class="row">
            <div class="col lg-12">
                <h3>Examples and demos</h3>
            </div>
        </div>
        <div class="row">
            <div class="col lg-12">
                <p>Here is a list of all examples and demos.</p>
                <ul>
                    <li v-for="ex in examples"><a :href="'/examples/' + ex">{{ ex }}</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {fetchJSON} from "../../../../libs/fetch-json";

    export default {
        name: "ExamplePage",

        data: function() {
            return {
                examples: []
            }
        },

        mounted: async function() {
            // gettings all examples
            const oResponse = await fetchJSON('/examples-list');
            this.examples = oResponse.list;
        }
    }
</script>

<style scoped>

</style>