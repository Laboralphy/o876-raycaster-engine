<template>
    <div>
        <div class="row">
            <div class="col lg-12">
                <div class="row">
                    <div class="col lg-12">
                        <h3>Basic Raycasting</h3>
                        <p>The primary task of a Raycasting Engine is to render 3D simplified environnement.
                            It is said that Raycasting is a 2.5D algorithm because the 3D environnement
                            is rendered from a 2D map and there are only perpendicular walls only flat floor and
                            ceiling, and so on... A lot of limitations that are not present in real 3D engines.</p>
                        <p>But this simplicity has its own advantages :
                        <ul>
                            <li>fast level design.</li>
                            <li>No need of complex geometry understanding.</li>
                            <li>runs on slow computers.</li>
                            <li>fast assets downloading.</li>
                        </ul>

                        <p>Let's have a look at what features are available in this engine...</p>
                    </div>
                </div>
            </div>
        </div>



        <div class="row">
            <div class="col lg-12">
                <div class="row">
                    <div class="col lg-12">
                        <h3>Door management</h3>
                        <p>There are several type of doors, the only difference is the way they open :
                            They can slide to any direction (left, right, top, bottom), there are even
                            double panel sliding doors as well.</p>
                        <div class="row">
                            <div class="col 4">
                                <figure>
                                    <img src="../../assets/images/feat-open-door-0.jpg" />
                                    <figcaption>Double panel door</figcaption>
                                </figure>

                            </div>
                            <div class="col 4">
                                <figure>
                                    <img src="../../assets/images/feat-open-door-1.jpg" />
                                    <figcaption>Top sliding door</figcaption>
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
                        <h3>Secret door management</h3>
                        <p>Just like the game <i>wolfenstein 3D</i>,
                            walls can be pushed to reveal secret areas.</p>
                        <div class="row">
                            <div class="col lg-4 sm-6 xs-12">
                                <figure>
                                    <img src="../../assets/images/feat-secret-door-0.jpg" />
                                    <figcaption>This wall has been pushed, and reveals a hidden zone !</figcaption>
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
                        <h3>Sprite management</h3>
                        <p>Animated sprites with composite effect (alpha, opacity...).
                            Each sprite can have several overlays so rendering "haze" effects
                            is possible.</p>
                        <div class="row">
                            <div class="col lg-4 sm-6 xs-12">
                                <figure>
                                    <img src="../../assets/images/game-blight.jpg" />
                                    <figcaption>Sprites from Blight Magic</figcaption>
                                </figure>

                            </div>
                            <div class="col lg-4 sm-6 xs-12">
                                <figure>
                                    <img src="../../assets/images/game-scr19.jpg" />
                                    <figcaption>Sprites from Blight Magic</figcaption>
                                </figure>

                            </div>
                            <div class="col lg-4 sm-6 xs-12">
                                <figure>
                                    <img src="../../assets/images/game-scr20.jpg" />
                                    <figcaption>Sprites from Blight Magic</figcaption>
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
                        <h3>Floor and ceiling textures</h3>
                        <p>Floor and ceiling can have textures, just like walls.</p>
                        <div class="row">
                            <div class="col lg-4 sm-6 xs-12">
                                <figure>
                                    <img src="../../assets/images/game-scr13.jpg" />
                                    <figcaption>Without floor and ceiling textures</figcaption>
                                </figure>

                            </div>
                            <div class="col lg-4 sm-6 xs-12">
                                <figure>
                                    <img src="../../assets/images/game-scr18.jpg" />
                                    <figcaption>With floor and ceiling textures (looks better)</figcaption>
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
                        <h3>Outdoor environnement / sky texture</h3>
                        <p>Wall, ceiling, and floor textures can be replaced by a sky texture.</p>
                        <div class="row">
                            <div class="col 4">
                                <figure>
                                    <img src="../../assets/images/feat-sky-0.jpg" />
                                    <figcaption>Sky is visible outside</figcaption>
                                </figure>

                            </div>
                            <div class="col 4">
                                <figure>
                                    <img src="../../assets/images/feat-sky-1.jpg" />
                                    <figcaption>Red sky</figcaption>
                                </figure>

                            </div>
                            <div class="col 4">
                                <figure>
                                    <img src="../../assets/images/feat-sky-2.jpg" />
                                    <figcaption>Sky is visible through the ceilling</figcaption>
                                </figure>

                            </div>
                            <div class="col 4">
                                <figure>
                                    <img src="../../assets/images/feat-sky-3.jpg" />
                                    <figcaption>Dark sky and landscape</figcaption>
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
                        <h3>Animated wall textures</h3>
                        <p>Walls can have animated textures.</p>
                        <div class="row">
                            <div class="col lg-4 sm-6 xs-12">
                                <figure>
                                    <img src="../../assets/images/feat-anim-wall-0.gif" />
                                    <figcaption>Fireplace</figcaption>
                                </figure>

                            </div>
                            <div class="col lg-4 sm-6 xs-12">
                                <figure>
                                    <img src="../../assets/images/feat-anim-wall-1.gif" />
                                    <figcaption>Pixelated fireplace</figcaption>
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
                        <h3>Dynamic texture modification</h3>
                        <p>Wall, floor and ceiling textures can be modified,
                            allowing programmer to draw anything on it (like drawing on a canvas and using canvas
                            context methods). This ability is used for static lighting (lighten walls that are
                            near light emmiting sources).</p>
                        <div class="row">
                            <div class="col lg-4 sm-6 xs-12">
                                <figure>
                                    <img src="../../assets/images/feat-decal-0.jpg" />
                                    <figcaption>Ketchup on the wall !</figcaption>
                                </figure>

                            </div>
                            <div class="col lg-4 sm-6 xs-12">
                                <figure>
                                    <img src="../../assets/images/feat-light-effects-1.jpg" />
                                    <figcaption>Candles may affect wall textures</figcaption>
                                </figure>

                            </div>
                            <div class="col lg-4 sm-6 xs-12">
                                <figure>
                                    <img src="../../assets/images/feat-light-effects-0.jpg" />
                                    <figcaption>Light emmitting objects cast light and shadows on both floor and ceiling</figcaption>
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
                        <h3>Using VR Glasses</h3>
                        <p>The framework has the ability to switch between normal rendering
                            and <b>VR Rendering</b>.</p>
                        <p>You should try it out with <a href="https://www.google.fr/search?q=vr+glasses+cardboard">
                            this kind of cardboard glasses</a>.</p>
                        <div class="row">
                            <div class="col lg-6 lg-offset-3 sm-8 sm-offset-2 xs-12 xs-offset-0">
                                <figure>
                                    <img src="../../assets/images/vr-glasses.jpg" />
                                    <figcaption>VR Glasses</figcaption>
                                </figure>

                            </div>
                        </div>

                        <div class="row">
                            <div class="col 4">
                                <figure>
                                    <img src="../../assets/images/feat-vr-00.jpg" />
                                    <figcaption>city : normal</figcaption>
                                </figure>

                            </div>
                            <div class="col 4">
                                <figure>
                                    <img src="../../assets/images/feat-vr-01.jpg" />
                                    <figcaption>city : vr-rendering</figcaption>
                                </figure>

                            </div>
                            <div class="col 4">
                                <figure>
                                    <img src="../../assets/images/feat-vr-10.jpg" />
                                    <figcaption>mansion : normal</figcaption>
                                </figure>

                            </div>
                            <div class="col 4">
                                <figure>
                                    <img src="../../assets/images/feat-vr-11.jpg" />
                                    <figcaption>mansion : vr-rendering</figcaption>
                                </figure>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FeatPage"
    }
</script>

<style scoped>

</style>