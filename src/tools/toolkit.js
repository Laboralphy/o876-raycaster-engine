export function getType(x) {
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

