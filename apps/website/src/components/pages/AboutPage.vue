<template>
    <div>
        <div class="row">
            <div class="col lg-12">
                <h3>About the O876 Raycaster Game Engine</h3>
                <p>The O876 Raycaster Game Engine is an open-source, free-to-use framework, for building web browser games base on raycasting technology.</p>
                <p>This project has been developped with some useful products and libraries.</p>
                <h3>For game developers...</h3>
                <p>
                  The purpose of this site is only to show the engine features. If you want to actually create a game with this technology,
                  consider visiting the Project GitHub Repository located at :
                  <a href="https://github.com/Laboralphy/o876-raycaster-engine">https://github.com/Laboralphy/o876-raycaster-engine</a>.
                </p>
            </div>
        </div>
        <div class="row">
            <div class="col lg-3 md-4 sm-6">
                <Logo
                        href="https://www.jetbrains.com/?from=javascript-raycasting-engine-raphael-marandet"
                        title="Fast and powerful IDE that integrates Vue.js perfectly"
                        caption="Webstorm IDE"
                ><img alt="logo" src="../../../assets/logos/logo-webstorm.svg" /></Logo>
            </div>
            <div class="col lg-3 md-4 sm-6">
                <Logo
                        href="https://www.jetbrains.com/?from=javascript-raycasting-engine-raphael-marandet"
                        title="Creators of Webstorm, Phpstorm and many more IDE that are essential for large and modern projects."
                        caption="Jetbrains"
                ><img alt="logo" src="../../../assets/logos/logo-jetbrains.svg" /></Logo>
            </div>
            <div class="col lg-3 md-4 sm-6">
                <Logo
                        href="https://vuejs.org/"
                        title="A cutting edge framework which is actually very fun to work with. Everything is faster with Vue.js."
                        caption="Vue.js"
                ><img alt="logo" src="../../../assets/logos/logo-vue-js.svg" /></Logo>
            </div>
            <div class="col lg-3 md-4 sm-6">
                <Logo
                        href="https://nodejs.org/"
                        title="A JavaScript runtime built on Chrome's V8 JavaScript engine."
                        caption="Node.js"
                ><img alt="logo" src="../../../assets/logos/logo-node-js-2.svg" /></Logo>
            </div>
            <div class="col lg-3 md-4 sm-6">
                <Logo
                        href="https://webpack.js.org/"
                        title="A module blunder. Essential when you write thousand of classes, files and assets."
                        caption="Webpack"
                ><img alt="logo" src="../../../assets/logos/logo-webpack.svg" /></Logo>
            </div>
            <div class="col lg-3 md-4 sm-6">
                <Logo
                        href="https://jasmine.github.io/"
                        title="I do test driven development !"
                        caption="Jasmine"
                ><img alt="logo" src="../../../assets/logos/logo-jasmine.svg" /></Logo>
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