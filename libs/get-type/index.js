/**
 * Return the type of a value as a string.
 *
 * @param {*} x - The value to determine the type of.
 * @returns {"undefined"|"null"|"boolean"|"number"|"string"|"function"|"symbol"|"bigint"|string} - The type of the value.
 */
function getType (x) {
    const tox = typeof x;
    switch (tox) {
    case 'undefined': {
        return 'undefined';
    }
    case 'object': {
        if (x === null) {
            return 'null';
        }
        return x.constructor.name.toLowerCase();
    }
    default: {
        return tox;
    }
    }
}

/**
 * Check if the type of a value matches the expected type.
 *
 * @param {*} x - The value to check the type of.
 * @param {string} sExpectedType - The expected type of the value.
 * @param {string} [sMessage='Type mismatch'] - The error message to throw if the type does not match.
 * @throws {TypeError} - If the type of the value does not match the expected type.
 */
function checkType (x, sExpectedType, sMessage = 'Type mismatch') {
    const s = getType(x);
    if (s !== sExpectedType) {
        throw new TypeError(sMessage + ' - expected type : ' + sExpectedType + ' - given type : ' + s);
    }
}

/**
 * Execute a function based on the type of a value.
 *
 * @param {*} x - The value to determine the type of.
 * @param {Object} oSwitcher - An object mapping types to functions.
 * @returns {*} - The result of the function execution.
 * @throws {TypeError} - If the type of the value is not found in the switcher object.
 */
function switchType (x, oSwitcher) {
    const sType = getType(x);
    if (sType in oSwitcher) {
        return oSwitcher[sType](x);
    }
    for (const [sEntry, f] of Object.entries(oSwitcher)) {
        if (sEntry.includes('|')) {
            const aTypes = sEntry.split('|').map(s => s.trim());
            if (aTypes.includes(sType)) {
                return f(x);
            }
        }
    }
    throw new TypeError('switchType has encountered unexpected type "' + sType + '"');
}

module.exports = {
    getType,
    checkType,
    switchType
};
