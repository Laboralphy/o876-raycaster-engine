/**
 * builds a key map of the given object
 * @param oObj {*}
 * @param path {string}
 * @returns {Array}
 */

class Extender {

    static getType(x) {
        let sType = typeof x;
        if (sType === 'object') {
            if (x === null) {
                return 'null';
            }
            if (Array.isArray(x)) {
                return 'array';
            }
        }
        return sType;
    }


    static objectKeyMap(oObj, path = '') {
        let a = [];
        for (let key in oObj) {
            if (oObj.hasOwnProperty(key)) {
                let newPath = path + '.' + key;
                if (Extender.getType(oObj[key]) === 'object') {
                    a = a.concat(Extender.objectKeyMap(oObj[key], newPath));
                } else {
                    a.push(newPath.substr(1));
                }
            }
        }
        return a;
    }

    /**
     * list all keys that are present in a2 and absent in a1
     * @param a1 {*}
     * @param a2 {*}
     * @return {{common: *[], missing: *[]}}
     */
    static objectDiffKeys(a1, a2) {
        const m1 = Extender.objectKeyMap(a1);
        const m2 = Extender.objectKeyMap(a2);
        const common = m2.filter(l => m1.includes(l));
        const missing = m2.filter(l => !m1.includes(l));
        return {common, missing};
    }

    /**
     * navigates into an object structure, according to the given path, and retrieves the node and key
     * in order to either set or get the values
     * @param oObj {*}
     * @param sBranch {string}
     * @returns {{node: *, key: string}}
     */
    static objectReachBranch(oObj, sBranch) {
        const aBranches = sBranch.split('.');
        const key = aBranches.pop();
        const node = aBranches.reduce((prev, next) => {
            if (next in prev) {
                return prev[next];
            } else {
                throw new Error('this key : "' + next + '" does not exist in this object');
            }
        }, oObj);
        return {node, key};
    }

    static objectMkBranch(oObj, sBranch) {
        const aBranches = sBranch.split('.');
        aBranches.pop();
        aBranches.reduce((prev, next) => {
            if (!(next in prev) || prev[next] === null || typeof prev[next] !== 'object') {
                prev[next] = {};
            }
            return prev[next];
        }, oObj);
    }

    /**
     * changes the value of an item, inside an objet at the given path
     * @param oObj {*}
     * @param sBranch {string}
     * @param newValue {*}
     */
    static objectSet(oObj, sBranch, newValue) {
        const {node, key} = Extender.objectReachBranch(oObj, sBranch);
        if (Object.isSealed(node) && !(key in node)) {
            throw new Error('cannot set ' + key + ' property : object is sealed');
        }
        node[key] = newValue;
    }

    /**
     * get the value of an item, inside an object at the given path
     * @param oObj {*}
     * @param sBranch {string}
     * @return {*}
     */
    static objectGet(oObj, sBranch) {
        if (oObj === undefined) {
            throw new Error('objectGet : undefined object')
        }
        const {node, key} = Extender.objectReachBranch(oObj, sBranch);
        return node[key];
    }

    /**
     * copies the items from "source" to "target"
     * @param oTarget
     * @param oSource
     * @param bExtends {boolean} if true, then the target will inherit all aditional branches present in oSource
     */
    static objectExtends(oTarget, oSource, bExtends = false) {
        const {common, missing} = Extender.objectDiffKeys(oTarget, oSource);
        common.forEach(path => {
            Extender.objectSet(oTarget, path, Extender.objectGet(oSource, path));
        });
        if (bExtends) {
            missing.forEach(path => {
                Extender.objectMkBranch(oTarget, path);
                Extender.objectSet(oTarget, path, Extender.objectGet(oSource, path));
            });
        }
        return oTarget;
    }
}

export default Extender;