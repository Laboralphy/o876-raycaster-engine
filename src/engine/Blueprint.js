class Blueprint {
    constructor() {
        this.tileset = null;
        this.thinker = '';
        this.animations = [];
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