/**
 * création rapide d'une matrice 2D
 * @param w {number}
 * @param h {number}
 * @param feed {function}
 * @param pType {ArrayConstructor|Uint8ArrayConstructor|Uint16ArrayConstructor|Uint32ArrayConstructor|BigUint64ArrayConstructor|Int8ArrayConstructor|Int16ArrayConstructor|Int32ArrayConstructor|BigInt64ArrayConstructor|Float32ArrayConstructor|Float64ArrayConstructor} row type (default : Array, can be Uint8Array, Float32Array ...)
 * @returns {[]}
 * @private
 */
function createArray2D (w, h, feed, pType = Array) {
    const a = [];
    for (let y = 0; y < h; ++y) {
        const r = new pType(w);
        for (let x = 0; x < w; ++x) {
            r[x] = feed instanceof Function
                ? feed(x, y)
                : feed;
        }
        a[y] = r;
    }
    return a;
}


function _createRow(aRow, pType = Array) {
    switch (pType) {
        case Array:
            return aRow;

        default:
            return new pType(aRow);
    }
}

/**
 * Parcoure l'integralité du tableau 2D et appelle un callback dont le retour permet de modifier la valeur
 * @param aArray2D {array}
 * @param cb {function}
 */
function walk2D(aArray2D, cb) {
    for (let y = 0, h = aArray2D.length; y < h; ++y) {
        const row = aArray2D[y];
        for (let x = 0, w = row.length; x < w; ++x) {
            row[x] = cb(x, y, row[x]);
        }
    }
}

/**
 * comme walk2D mais créé un nouveau tableau
 * @param aArray2D
 * @param pType {ArrayConstructor} row type (default : Array, can be Uint8Array, Float32Array ...)
 * @param cb
 */
function map2D(aArray2D, cb, pType = Array) {
    return aArray2D.map((row, y) => _createRow(row.map((cell, x) => cb(x, y, cell))), pType);
}

function rotate(aArray, bDirect = false) {
    const n = aArray.length;
    if (n === 0) {
        return [];
    }
    return createArray2D(n, n, (x, y) => bDirect
        ? aArray[x][n - y - 1]
        : aArray[n - x - 1][y], aArray[0].constructor
    );
}

function rotateTwice(aArray) {
    const a = rotate(aArray);
    return rotate(aArray, a);
}

module.exports = {
    rotate,
    createArray2D,
    map2D,
    rotateTwice,
    walk2D
};