/**
 * This class is use to observe all mutations against an object, like Poppy.
 *
 */
class Reactor {

    constructor(obj) {
        this.clear();
        this.makeReactiveObject(obj);
    }

    getLog() {
        return Object.keys(this._log);
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
    notify(path) {
        path = path.substr(1);
        this._log[path] = true;
    }

    /**
     * Wraps an array method, so when it is called, it triggers the notify method
     * @param arr {Array}
     * @param sMethod {string}
     * @param path {string}
     */
    makeReativeArrayMethod(arr, sMethod, path) {
        const oSelf = this;
        arr[sMethod] = (...args) => {
            oSelf.notify(path);
            return Array.prototype[sMethod].apply(arr, args);
        };
    }

    /**
     * renders an array reactive, when items are changed, the notification is triggered
     * @param obj {*}
     * @param key {string}
     * @param path {string}
     */
    makeReactiveArray(obj, key, path) {
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
        this.notify(path);
        meth.forEach(m => this.makeReativeArrayMethod(arr, m, path));
    }

    /**
     * Renders a single scalar value, (including bool, number, string), reactive
     * @param obj {*}
     * @param key {string}
     * @param path {string}
     * @return {*}
     */
    makeReactiveScalar(obj, key, path) {
        let val = obj[key];
        path += '.' + key;
        const oSelf = this;

        this.notify(path);

        Object.defineProperty(obj, key, {
            get() {
                return val // Simply return the cached value
            },
            set(newVal) {
                val = newVal; // Save the newVal
                oSelf.notify(path);
            }
        });
    }

    /**
     * makes an item reactive
     * @param obj
     * @param key
     * @param path
     */
    makeReactiveItem(obj, key, path) {
        switch (Array.isArray(obj[key]) ? 'array' : typeof obj[key]) {
            case 'object':
                this.makeReactiveObject(obj[key], path + '.' + key);
                break;

            case 'array':
                this.makeReactiveArray(obj, key, path);
                break;

            default:
                this.makeReactiveScalar(obj, key, path);
                break;
        }
    }

    makeReactiveObject(obj, path) {
        if (path === undefined) {
            path = '';
        }
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                this.makeReactiveItem(obj, key, path);
            }
        }
    }
}

export default Reactor;