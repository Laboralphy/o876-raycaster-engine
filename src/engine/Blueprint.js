class Blueprint {
    constructor() {
        this.tileset = null;
        this.thinker = '';
        this.animations = [];
        this.size = 0; // physical half size (radius)
        this.fx = [];
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