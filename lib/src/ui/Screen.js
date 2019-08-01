import ManagedElement from "./ManagedElement";
import PointerLock from '../pointer-lock';
import Events from 'events';

class Screen {

    constructor(comp) {
        this._events = new Events();
        this._handlers = {
            resize: null,
            click: null,
        };
        this._surface = null;
        this._overlay = null;
        const pl = new PointerLock();
        pl.init();
        pl.on('mousemove', event => this._events.emit('mousemove', event));
        pl.on('enter', event => this._events.emit('pointerlockenter'));
        pl.on('exit', event => this._events.emit('pointerlockexit'));
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
        fullscreen = false
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
                    const oClicked = this._getClickEventOffset(event);
                    this._events.emit('click', oClicked);
                    this._pointerlock.requestPointerLock(this.overlay);
                };
                this.overlay.addEventListener('click', this._handlers.click);
            } else {
                this._handlers.click = event => {
                    const oClicked = this._getClickEventOffset(event);
                    this._events.emit('click', oClicked);
                    this._pointerlock.requestPointerLock(this.surface);
                };
                this.surface.addEventListener('click', this._handlers.click);
            }
        }
    }
}

export default Screen;