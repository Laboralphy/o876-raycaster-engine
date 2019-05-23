/**
 * A Sprite is an object that is visible inside the Raycaster Environment
 */

import TileAnimation from './TileAnimation';

class Sprite {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.h = 0;

        this._visible = true;
        this._scale = 1;

        this._animations = {};
        this._animation = null;
        this._currentAnim = {
            ref: '',
            dir: 0
        };
        this._tileset = null;

        this._children = []; // these sprites will be rendered above the current sprite

        this._flags = 0;
    }

    get flags() {
        return this._flags;
    }

    set flags(v) {
        this._flags = v;
    }

    addFlag(v) {
        this._flags |= v;
    }

    removeFlag(v) {
        this._flags = this._flags & ~v;
    }

    hasFlag(v) {
        return (this._flags & v) !== 0
    }

    get animation() {
        return this._animation;
    }

    set animation(value) {
        this._animation = value;
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

    buildAnimation({start = 0, length = 1, duration = 100, loop = 0, iterations = Infinity}, ref = 'default') {
        const a = new TileAnimation();
        if (Array.isArray(start)) {
            start.forEach(x => this.buildAnimation({start: x, length, duration, loop, iterations}, ref));
            return;
        }
        a.base = start;
        a.count = length;
        a.duration = duration;
        a.loop = loop;
        a.iterations = iterations === null ? Infinity : iterations;
        if (!(ref in this._animations)) {
            this._animations[ref] = [];
        }
        this._animations[ref].push(a);
        if (this._animation === null) {
            this._animation = a;
        }
    }


    /**
     * Defines the current animation
     * @param ref {string} animation group
     * @param iAnim {number} index of the new current animation
     */
    setCurrentAnimation(ref, iAnim = undefined) {
        const ca = this._currentAnim;
        const bSameRef = ca.ref === ref;
        if (iAnim === undefined) {
            if (bSameRef) {
                return;
            }
            iAnim = Math.min(ca.dir, this._animations[ref].length);
        }
        ca.ref = ref;
        this._animation = this._animations[ref][iAnim];
        this._animation.index = 0;
    }

    getCurrentAnimation() {
        return this._animation;
    }

    /**
     * For a directionnal sprite, sets a new direction
     */
    setDirection(nDirection) {
        const ca = this._currentAnim;
        const caRef = ca.ref;
        if (!(caRef in this._animations)) {
            return;
            throw new Error('this reference : "' + caRef + '" is not in current animation');
        }
        // caRef is the last animation type set
        if (this._animations[caRef].length > 1) {
            // this animation is directional
            const {index, time, loopDir} = this._animation;
            this.setCurrentAnimation(caRef, nDirection);
            const a = this._animation;
            a.index = index;
            a.time = time;
            a.loopDir = loopDir;
            ca.dir = nDirection;
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
        return !!this._animation ? this._animation.frame() : 0;
    }


    /**
     * proxy method for current animation animate method
     * @param time {number}
     */
    animate(time) {
        if (this._animation) {
            this._animation.animate(time);
        }
        const c = this._children;
        for (let i = 0, l = c.length; i < l; ++i) {
            c[i].animate(time);
        }
    }
}


export default Sprite;