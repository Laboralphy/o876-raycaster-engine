<template>
    <div>
        <div class="row">
            <div class="col lg-12">
                <div class="row">
                    <div class="col lg-12">
                        <h3>Making old-school games with Raycasting.</h3>
                        <p>If you are interested in old game technologies like Raycasting, that were used during the early 90's,
                        and if you wonder how is it possible to build web games with such tech, then you are in the right place.</p>
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
        name: "TechPage"
    }
</script>

<style scoped>

</style>