import Thinker from "./Thinker";

class DevKbd extends Thinker {

    constructor() {
        super();
        this._keys = {};
        this._lastTime = 0;
    }

    keyDown(key) {
        switch (key) {
            case 'ArrowUp':
                this._keys.up = this._lastTime;
                break;

            case 'ArrowDown':
                this._keys.down = this._lastTime;
                break;

            case 'ArrowLeft':
                this._keys.left = this._lastTime;
                break;

            case 'ArrowRight':
                this._keys.right = this._lastTime;
                break;
        }
    }

    keyUp(key) {
        switch (key) {
            case 'ArrowUp':
                this._keys.up = false;
                break;

            case 'ArrowDown':
                this._keys.down = false;
                break;

            case 'ArrowLeft':
                this._keys.left = false;
                break;

            case 'ArrowRight':
                this._keys.right = false;
                break;
        }
    }

    think(entity, engine) {
        this._lastTime = engine.getTime();
        const k = this._keys;
        if (k.up !== false) {
            entity.location.forward(4);
        }
        if (k.down !== false) {
            entity.location.forward(-4);
        }
        if (k.right !== false) {
            entity.location.angle -= 0.05;
        }
        if (k.left !== false) {
            entity.location.angle += 0.05;
        }
    }
}

export default DevKbd;