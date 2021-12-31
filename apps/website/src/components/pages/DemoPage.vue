<template>
    <div>
        <div class="row">
            <div class="col lg-12">
                <h3>Examples and demos</h3>
            </div>
        </div>
        <div class="row">
            <div class="col lg-12">
                <p>Here is a list of all examples and demos.
                  All these demos actually use the Raycaster Engine and run on you browser.
                  So you may use your keyboard to control the camera.</p>
                <ul>
                    <li v-for="ex in demos"><a :href="'/demo/' + ex">{{ ex }}</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {fetchJSON} from "libs/fetch-json";

    export default {
        name: "DemoPage",

        data: function() {
            return {
                demos: []
            }
        },

        mounted: async function() {
            // gettings all demos
            const oResponse = await fetchJSON('/demo/list');
            this.demos = oResponse.list;
        }
    }
</script>

<style scoped>

</style>