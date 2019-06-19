import ManagedElement from "./ManagedElement";
import PointerLock from '../pointer-lock';

class Screen {

    constructor(comp) {
        this._handlers = {
            resize: null,
            click: null,
        };
        this._surface = null;
        this._overlay = null;
        const pl = new PointerLock();
        pl.init();
        pl.on('mousemove', event => this.mouseMoveHandler(event));
        pl.on('enter', event => console.log('enter pointer lock'));
        pl.on('exit', event => console.log('exit pointer lock'));
        this._pointerlock = pl;
        this.buildStructure(comp);
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

    mouseMoveHandler(event) {
        console.log('mouse moved', event);
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
            window.removeEventListener('click', this._handlers.click);
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
                this._pointerlock.requestPointerLock(this.overlay);
            };
            window.addEventListener('click', this._handlers.click)
        }
    }
}

export default Screen;