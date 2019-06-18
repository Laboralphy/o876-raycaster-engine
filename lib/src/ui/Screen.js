import ManagedElement from "./ManagedElement";

class Screen {

    constructor(comp) {
        this._handlers = {
            resize: null
        };
        this._surface = null;
        this._overlay = null;
        this.buildStructure(comp);
    }

    get surface() {
        return this._surface.element;
    }

    get overlay() {
        return this._overlay.element;
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
        if (autostretch) {
            this._handlers.resize = () => {
                this._surface.autoStretch();
                this._overlay.autoStretch();
            };
            window.addEventListener('resize', this._handlers.resize);
        }
    }
}

export default Screen;