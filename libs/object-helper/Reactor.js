import Events from 'events';
import Extender from "./Extender";

const REACTOR_PROP_NAME = '__reactor__';
const REACTOR_CHANGED_EVENT_NAME = 'changed';

/**
 * This class is use to observe all mutations against an object.
 */
class Reactor {
    constructor(obj) {
        this._events = new Events();
        this._log = [];
        this.clear();
        this.makeReactiveObject(obj, undefined, obj);
    }

    get events() {
        return this._events;
    }

    getLog() {
        return Object.keys(this._log);
    }

    /**
     * remove all event handler, and clears the log to save memory
     */
    dispose() {
        this._events.removeAllListeners(REACTOR_CHANGED_EVENT_NAME);
        this.clear();
    }

    /**
     * clears the mutation log
     */
    clear() {
        this._log = {};
    }

    /**
     * add a hierarchic key to the mutation log
     * @param path {string} hierarchic key
     */
    notify(path, oRoot) {
        path = path.substr(1);
        this._log[path] = true;
        const value = Extender.objectGet(oRoot, path);
        this._events.emit(REACTOR_CHANGED_EVENT_NAME, {key: path, root: oRoot, value});
    }

    /**
     * Wraps an array method, so when it is called, it triggers the notify method
     * @param arr {Array}
     * @param sMethod {string}
     * @param path {string}
     * @param oRoot {object} root object
     */
    makeReactiveArrayMethod(arr, sMethod, path, oRoot) {
        const oSelf = this;
        arr[sMethod] = (...args) => {
            oSelf.notify(path, oRoot);
            return Array.prototype[sMethod].apply(arr, args);
        };
    }

    /**
     * renders an array reactive, when items are changed, the notification is triggered
     * @param obj {*}
     * @param key {string}
     * @param path {string}
     * @param oRoot {object} root object
     */
    makeReactiveArray(obj, key, path, oRoot) {
        const arr = obj[key];
        path += '.' + key;
        const meth = [
            'push',
            'pop',
            'shift',
            'unshift',
            'sort',
            'splice',
            'reverse'
        ];
        this.notify(path, oRoot);
        meth.forEach(m => this.makeReactiveArrayMethod(arr, m, path, oRoot));
    }

    /**
     * Renders a single scalar value, (including bool, number, string), reactive
     * @param obj {*}
     * @param key {string}
     * @param path {string}
     * @param oRoot {object} root object
     * @return {*}
     */
    makeReactiveScalar(obj, key, path, oRoot) {
        let val = obj[key];
        path += '.' + key;
        const oSelf = this;

        this.notify(path, oRoot);

        Object.defineProperty(obj, key, {
            get() {
                return val; // Simply return the cached value
            },
            set(newVal) {
                if (val !== newVal) {
                    val = newVal; // Save the newVal
                    oSelf.notify(path, oRoot);
                }
            }
        });
    }

    /**
     * makes an item reactive
     * @param obj
     * @param key
     * @param path
     * @param oRoot {object} root object
     */
    makeReactiveItem(obj, key, path, oRoot) {
        switch (Extender.getType(obj[key])) {
            case 'object':
                this.makeReactiveObject(obj[key], path + '.' + key, oRoot);
                break;

            case 'array':
                this.makeReactiveArray(obj, key, path, oRoot);
                break;

            default:
                this.makeReactiveScalar(obj, key, path, oRoot);
                break;
        }
    }

    makeReactiveObject(obj, path, oRoot) {
        if (path === undefined) {
            path = '';
            oRoot = obj;
        }
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                this.makeReactiveItem(obj, key, path, oRoot);
            }
        }
        Object.seal(obj);
    }
}

export default Reactor;