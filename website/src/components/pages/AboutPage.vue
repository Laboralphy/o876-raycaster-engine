<template>
    <div>
        <div class="row">
            <div class="col lg-12">
                <h3>About the O876 Raycaster Game Engine</h3>
                <p>The O876 Raycaster Engine is an open-source, free-to-use Raycasting framework, for building web browser games.</p>
                <p>This project has been developped with some useful products and libraries.</p>
            </div>
        </div>
        <div class="row">
            <div class="col lg-3 md-4 sm-6">
                <Logo
                        src="../../assets/logos/logo-webstorm.svg"
                        href="https://www.jetbrains.com/?from=javascript-raycasting-engine-raphael-marandet"
                        title="Fast and powerful IDE that integrates Vue.js perfectly"
                >Webstorm IDE</Logo>
            </div>
            <div class="col lg-3 md-4 sm-6">
                <Logo
                        src="../../assets/logos/logo-jetbrains.svg"
                        href="https://www.jetbrains.com/?from=javascript-raycasting-engine-raphael-marandet"
                        title="Creators of Webstorm, Phpstorm and many more IDE that are essential for large and modern projects."
                >Jetbrains</Logo>
            </div>
            <div class="col lg-3 md-4 sm-6">
                <Logo
                        src="../../assets/logos/logo-vue-js.svg"
                        href="https://vuejs.org/"
                        title="A cutting edge framework which is actually very fun to work with. Everything is faster with Vue.js."
                >Vue.js</Logo>
            </div>
            <div class="col lg-3 md-4 sm-6">
                <Logo
                        src="../../assets/logos/logo-node-js-2.svg"
                        href="https://nodejs.org/"
                        title="A JavaScript runtime built on Chrome's V8 JavaScript engine."
                >Node.js</Logo>
            </div>
            <div class="col lg-3 md-4 sm-6">
                <Logo
                        src="../../assets/logos/logo-webpack.svg"
                        href="https://webpack.js.org/"
                        title="A module blunder. Essential when you write thousand of classes, files and assets."
                >Webpack</Logo>
            </div>
            <div class="col lg-3 md-4 sm-6">
                <Logo
                        src="../../assets/logos/logo-jasmine.svg"
                        href="https://jasmine.github.io/"
                        title="I do test driven development !"
                >Jasmine</Logo>
            </div>
        </div>
        <div class="col lg-12">
            <h3>About Raphaël Marandet, the author...</h3>
            <p>I spend too much time building games...</p>
        </div>
    </div>
</template>

<script>
    import Logo from "../Logo.vue";

    export default {
        name: "AboutPage",
        components: {Logo}
    }
</script>

<style scoped>

</style>