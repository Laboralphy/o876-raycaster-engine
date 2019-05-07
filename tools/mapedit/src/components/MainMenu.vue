<template>
    <StatusBar>
        <MyButton
                v-for="r in routes"
                :key="r.route"
                :title="r.title"
                :class="currentRoute === r.route ? 'selected' : ''"
                @click="$router.push(r.route)"
                style="margin-right: 0.5em"
        >{{ r.caption }}</MyButton>
    </StatusBar>
</template>

<script>
    import StatusBar from "./StatusBar.vue";
    import MyButton from "./MyButton.vue";

    export default {
        name: "MainMenu",
        components: {
            MyButton,
            StatusBar
        },
        data: function() {
            return {
                routes: [
                    {
                        route: '/',
                        caption: 'Level',
                        title: 'Level editor'
                    },
                    {
                        route: '/load-tiles',
                        caption: 'Tiles',
                        title: 'Load tileset and import wall and flat tiles'
                    },
                    {
                        route: '/build-anim',
                        caption: 'Anim.',
                        title: 'Make animated textures'
                    }
                ],

                currentRoute: '/'
            }
        },

        watch:{
            $route (to, from){
                const s = to.fullPath;
                if (s !== this.currentRoute) {
                    this.currentRoute = s;
                }
            }
        },
    }
</script>

<style scoped>
    .selected {
        filter: brightness(150%);
        color: #0000FF;
    }
</style>