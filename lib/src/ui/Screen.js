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
        return this._overlay.element;
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
        const mSurface = new ManagedElement(surface);
        const mOverlay = new ManagedElement(overlay);
        mOverlay.width = mSurface.width;
        mOverlay.height = mSurface.height;
        mSurface.autoStretch();
        this._surface = mSurface;
        this._overlay = mOverlay;
        mOverlay.autoStretch();
        window.addEventListener('resize', () => {
            mSurface.autoStretch();
            mOverlay.autoStretch();
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
            this.overlay.removeEventListener('click', this._handlers.click);
            this._handlers.click = null;
        }
        if (autostretch) {
            this._handlers.resize = () => {
                this._surface.autoStretch();
                this._overlay.autoStretch();
            };
            window.addEventListener('resize', this._handlers.resize);
        }
        if (pointerlock && PointerLock.hasPointerLockFeature()) {
            this._handlers.click = event => {
                const oClicked = this._getClickEventOffset(event);
                this._events.emit('click', oClicked);
                this._pointerlock.requestPointerLock(this.overlay);
            };
            this.overlay.addEventListener('click', this._handlers.click);
        }
    }
}

export default Screen;