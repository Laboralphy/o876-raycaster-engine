<template>
    <div>
        <div class="row">
            <div class="col lg-12">
                <div class="row">
                    <div class="col lg-12">
                        <h3>Making old-school games with Raycasting.</h3>
                        <p>You are currently reading something about my <b>Raycasting engine</b> :
                            A game engine that can build 3Dish games like the ones that were out
                            during the early 1990's. Titles like <i>Doom</i>, <i>Duke Nukem 3D</i>
                            and others come to mind.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col lg-12">
                <div class="row">
                    <div class="col lg-8 xs-12">
                        <h3>What is Raycasting ?</h3>
                        <p>Raycasting is a 3D rendering method using simple computations.
                            It renders 3D environments but with lots of limitation to ensure the highest frame rate.
                        </p>
                        <p>This technology was mainly used in older 90's games like <b>Wolfenstein 3D</b>
                            and <b>Doom</b>. Games built around this rendering method are easily designed because they are
                            essentially build out of a 2D map.</p>
                        <hr/>
                        <h3>Main features</h3>
                        <ul>
                            <li>The engine is 100% javascript</li>
                            <li>Supported by any serious HTML 5 Browsers like Firefox, Google Chrome and Chromium.</li>
                            <li>Fair performances : games will run at around 25 fps on older architectures like Intel Core2 Duo.</li>
                            <li>Full screen, Pointer lock, and Audio support (mp3 and ogg).</li>
                            <li>An HTML 5 Level Editor is available online - Designing levels is now easy.</li>
                        </ul>

                    </div>
                    <div class="col lg-4 xs-12">
                        <figure>
                            <img alt="raycasting explained" src="../../assets/images/fig-raycasting.png"/>
                            <figcaption>How raycasting works.</figcaption>
                        </figure>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col lg-12">
                <div class="row">
                    <div class="col lg-12">
                        <h3>What does it look like ?</h3>
                        <div class="row">
                            <div class="col 4">
                                <figure>
                                    <img src="../../assets/images/game-ambush.jpg" />
                                    <figcaption>Reikaster underland (ambush in forest)</figcaption>
                                </figure>

                            </div>
                            <div class="col 4">
                                <figure>
                                    <img src="../../assets/images/game-underwater.jpg" />
                                    <figcaption>Reikaster underland (underwater)</figcaption>
                                </figure>

                            </div>
                            <div class="col 4">
                                <figure>
                                    <img src="../../assets/images/game-mansion-1.jpg" />
                                    <figcaption>The mansion</figcaption>
                                </figure>

                            </div>
                            <div class="col 4">
                                <figure>
                                    <img src="../../assets/images/game-mansion-7.jpg" />
                                    <figcaption>The mansion (interior)</figcaption>
                                </figure>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>


        <div class="row">
            <div class="col lg-12">
                <div class="row">
                    <div class="col lg-12">
                        <h3>Inspirations</h3>
                        <p>The Engine use the very same technics used by old 90's first person shooter games. The most popular in this genre was <b>Wolfenstein 3D</b>.</p>
                        <div class="row"><div class="col lg-offset-4 md-6 md-offset-3 sm-12 sm-offset-0">
                            <figure>
                                <img src="../../assets/images/wolf3d.jpg"/>
                                <figcaption>Wolfenstein 3D by Id Sofware</figcaption>
                            </figure>
                        </div></div>

                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "HomePage"
    }
</script>

<style scoped>

</style>