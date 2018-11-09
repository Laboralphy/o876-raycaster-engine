/**
 * A Sprite is an object that is visible inside the Raycaster Environment
 */

class Sprite {
    constructor() {
        this.x = 0;
        this.y = 0;

        this._tileWidth = 0;
        this._tileHeight = 0;

        this._animations = [];
        this._animation = null;
        this._tileset = null;
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


    /**
     * proxy method for current animation animate method
     * @param time {number}
     */
    animate(time) {
        this._animation.animate(time);
    }



}


export default Sprite;