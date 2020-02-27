class Blueprint {
    constructor() {
        this.tileset = null;
        this.thinker = null;
        this.animations = [];
        this.size = 0; // physical half size (radius)
        this.fx = [];
        this.data = {};
    }

    /**
     * build animation for the specified sprite.
     * @param sprite {Sprite} sprite that is being instanciate
     */
    buildAnimations(sprite) {
        this.animations.forEach(anim => {
            sprite.buildAnimation(anim);
        });
    }
}

export default Blueprint;