function objectKeyMap(oObj, path) {
    if (path === undefined) {
        path = '';
    }
    let a = [];
    for (let key in oObj) {
        if (oObj.hasOwnProperty(key)) {
            let newPath = path + '.' + key;
            if (typeof oObj[key] === 'object' && !Array.isArray(oObj[key])) {
                a = a.concat(objectKeyMap(oObj[key], newPath));
            } else {
                a.push(newPath);
            }
        }
    }
    return a;
}

function objectChangeBranch(oObj, sBranch, newValue) {
    let aBranches = sBranch.split('.');
    let sLastKey = aBranches.pop();
    let o = aBranches.reduce((prev, next) => prev[next], oObj);
    o[sLastKey] = newValue;
}