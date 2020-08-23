import ManagedElement from "./ManagedElement";
import PointerLock from '../pointer-lock';
import Events from 'events';

/**
 * The screen class manages a surface (usually a canvas or a video) and an overlay (usually a div).
 * This screen is dedicated to games, because it will lock the mouse when the surface is clicked.
 * the overlay acts as a User Interface, located above the surface, so that information may be
 * print over the game/media surface layer.
 *
 * The class emits several events :
 * - mousemove ({x, y}) : the mouse is mouved over the surface
 * - pointerlock.enter : the request pointer lock have been successfully accepted
 * - pointerlock.exit : the user has hit 'ESC' to exit pointer lock
 *
 * DON'T FORGET
 * to set request-pointer-lock attributes on overlay items you want them to enter pointer lock when clicked on.
 */
class Screen {

    constructor(comp) {
        this._events = new Events();
        this._handlers = {
            resize: null,
            click: null,
        };
        this._surface = null;
        this._overlay = null;
        this._enablePointerlock = true;
        const pl = new PointerLock();
        pl.init();
        pl.on('mousemove', event => this._events.emit('mousemove', event));
        pl.on('enter', event => this._events.emit('pointerlock.enter'));
        pl.on('exit', event => this._events.emit('pointerlock.exit'));
        this._pointerlock = pl;
        this.buildStructure(comp);
    }

    on(...args) {
        this._events.on(...args);
    }

    off(...args) {
        this._events.off(...args);
    }

    get surface() {
        return this._surface.element;
    }

    get overlay() {
        return !!this._overlay ? this._overlay.element : null;
    }

    get pointerlock() {
        return this._pointerlock;
    }

    _getClickEventOffset(event) {
        let el = event.target,
            x = 0,
            y = 0;

        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            x += el.offsetLeft - el.scrollLeft;
            y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }

        x = event.clientX - x;
        y = event.clientY - y;

        return { x, y };
    }

    /**
     * Screen and overlay initialization.
     * Will imbue specified canvas with auto-stretch capabilities.
     */
    buildStructure({
        surface,
        overlay
    }) {
        // game surface
        const mSurface = new ManagedElement(surface);
        this._surface = mSurface;
        mSurface.autoStretch();

        // overlay
        if (!!overlay) {
            const mOverlay = new ManagedElement(overlay);
            this._overlay = mOverlay;
            mOverlay.width = mSurface.width;
            mOverlay.height = mSurface.height;
            mOverlay.autoStretch();
        }
        window.addEventListener('resize', () => {
            this._surface.autoStretch();
            if (!!this._overlay) {
                this._overlay.autoStretch();
            }
        });
    }

    setup({
        autostretch = false,
        pointerlock = false,
        fullscreen = false,
        pointerlockAttribute = 'data-request-pointer-lock'
    }) {
        if (!!this._handlers.resize) {
            window.removeEventListener('resize', this._handlers.resize);
            this._handlers.resize = null;
        }
        if (!!this._handlers.click) {
            if (this.overlay) {
                this.overlay.removeEventListener('click', this._handlers.click);
            }
            this._handlers.click = null;
        }
        if (autostretch) {
            this._handlers.resize = () => {
                this._surface.autoStretch();
                if (!!this._overlay) {
                    this._overlay.autoStretch();
                }
            };
            window.addEventListener('resize', this._handlers.resize);
        }
        if (pointerlock && PointerLock.hasPointerLockFeature()) {
            if (!!this.overlay) {
                this._handlers.click = event => {
                    if (this._enablePointerlock) {
                        const oClicked = this._getClickEventOffset(event);
                        this._events.emit('click', oClicked);
                        const oTarget = event.target;
                        if (oTarget === this._surface || oTarget === this._overlay || oTarget.hasAttribute(pointerlockAttribute)) {
                            this._pointerlock.requestPointerLock(this.surface);
                        }
                    }
                };
                this.overlay.addEventListener('click', this._handlers.click);
            } else {
                this._handlers.click = event => {
                    if (this._enablePointerlock) {
                        const oClicked = this._getClickEventOffset(event);
                        this._events.emit('click', oClicked);
                        this._pointerlock.requestPointerLock(this.surface);
                    }
                };
                this.surface.addEventListener('click', this._handlers.click);
            }
        }
    }
}

export default Screen;