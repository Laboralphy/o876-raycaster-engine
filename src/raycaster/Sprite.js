/**
 * A Sprite is an object that is visible inside the Raycaster Environment
 */

class Sprite {
    constructor() {
        this.x = 0;
        this.y = 0;

        this._visible = true;
        this._scale = 1;

        this._tileWidth = 0;
        this._tileHeight = 0;

        this._animations = [];
        this._animation = null;
        this._tileset = null;
    }

    get visible() {
        return this._visible;
    }

    set visible(value) {
        this._visible = value;
    }

    get scale() {
        return this._scale;
    }

    set scale(value) {
        this._scale = value;
    }

    /**
     * Adds a new animations into the sprite's animation collection
     * @param a {TileAnimation}
     */
    addAnimation(a) {
        this._animations.push(a);
    }

    /**
     * Defines the current animation
     * @param iAnim {number} index of the new current animation
     */
    setCurrentAnimation(iAnim) {
        const animations = this._animations;
        if (iAnim >= 0 && iAnim < animations.length) {
            this._animation = this._animations[iAnim];
        } else {
            throw new Error('cannot select "' + iAnim + '" as new current animation : this sprite has "' + animations.length + '" animations');
        }
    }

    /**
     * Defines the sprite tileset
     * @param ts {ShadedTileSet}
     */
    setTileSet(ts) {
        this._tileset = ts;
    }

    getTileSet() {
        return this._tileset;
    }

    getCurrentFrame() {
        return this._animation.getCurrentFrame();
    }


    /**
     * proxy method for current animation animate method
     * @param time {number}
     */
    animate(time) {
        this._animation.animate(time);
    }



}


export default Sprite;