<template>
    <div class="simple-menu">
        <MyButton
                v-for="r in routes"
                :key="r.route"
                :title="r.title"
                :class="(currentRoute === r.route) || ('highlight' in r && !!currentRoute.match(r.highlight)) ? 'selected' : ''"
                @click="go(r.route)"
                style="margin-right: 0.25em; margin-left: 0.25em"
        ><component :is="r.icon" decorative :title="r.title"></component> {{ r.caption }}</MyButton>
    </div>
</template>

<script>
    import MyButton from "./MyButton.vue";

    export default {
        name: "SimpleMenu",
        components: {
            MyButton,
        },
        props: ['routes'],
        data: function() {
            return {
                currentRoute: ''
            }
        },


        watch:{
            $route: {
                handler: function (to, from) {
                    const s = to.fullPath;
                    if (s !== this.currentRoute) {
                        this.currentRoute = s;
                    }
                },
                immediate: true
            }
        },

        methods: {
            go: function(sRoute) {
                this.$router.push(sRoute);
            }
        }
    }
</script>

<style scoped>
    .simple-menu {
        display: inline-block;
    }

    .selected {
        filter: brightness(150%);
        color: #0000FF;
    }
</style>