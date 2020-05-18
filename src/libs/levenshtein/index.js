/**
 * compute levenshtein distance between 2 strings
 * @param a {string} string source
 * @param b {string} string cible
 * @returns {number}
 */
export function distance(a, b) {
    if (a.length === 0) {
        return b.length;
    }
    if (b.length === 0) {
        return a.length;
    }

    let al = a.length;
    let bl = b.length;
    let i, j;

    let matrix = [];

    // increment along the first column of each row
    for (i = 0; i <= bl; ++i) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    for (j = 0; j <= al; ++j) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= bl; ++i) {
        for (j = 1; j <= al; ++j) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
}


/**
 * checks all strings inside aStrings and selects the most similar to sSubject
 * @param sSubject
 * @param aStrings
 * @returns {*}
 */
export function suggest(sSubject, aStrings) {
    return aStrings
        .map(s => ({
            s,
            d: distance(sSubject, s)
        }))
        .sort((a, b) => a.d - b.d)
        .shift()
        .s;
}


