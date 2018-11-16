/**
 * builds a key map of the given object
 * @param oObj {*}
 * @param path {string}
 * @returns {Array}
 */

class ObjectExtender {

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
                if (ObjectExtender.getType(oObj[key]) === 'object') {
                    a = a.concat(ObjectExtender.objectKeyMap(oObj[key], newPath));
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
        const m1 = ObjectExtender.objectKeyMap(a1);
        const m2 = ObjectExtender.objectKeyMap(a2);
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
        const node = aBranches.reduce((prev, next) => prev[next], oObj);
        return {node, key};
    }

    /**
     * changes the value of an item, inside an objet at the given path
     * @param oObj {*}
     * @param sBranch {string}
     * @param newValue {*}
     */
    static objectSet(oObj, sBranch, newValue) {
        const {node, key} = ObjectExtender.objectReachBranch(oObj, sBranch);
        node[key] = newValue;
    }

    /**
     * get the value of an item, inside an object at the given path
     * @param oObj {*}
     * @param sBranch {string}
     * @return {*}
     */
    static objectGet(oObj, sBranch) {
        const {node, key} = ObjectExtender.objectReachBranch(oObj, sBranch);
        return node[key];
    }

    /**
     * copies the items from "source" to "target"
     * @param oTarget
     * @param oSource
     */
    static objectExtends(oTarget, oSource) {
        const {common, missing} = ObjectExtender.objectDiffKeys(oTarget, oSource);
        common.forEach(path => {
            ObjectExtender.objectSet(oTarget, path, ObjectExtender.objectGet(oSource, path));
        });
    }
}

export default ObjectExtender;