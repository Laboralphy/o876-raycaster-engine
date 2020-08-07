const path = require('path');
const fs = require('fs');

const DIR_NAME = __dirname;

/**
 * Lists all index files in a given location
 * @param sSource {string} source location
 * @param sEntry {string} entry point
 * @returns {{}}
 */
function lsIndex(sSource, sEntry) {
    const sPath = path.resolve(DIR_NAME, sSource);
    const output = {};
    fs
        .readdirSync(sPath)
        .forEach(f => output[f] = path.resolve(sPath, f, sEntry));
    return output;
}

/**
 * The examples
 * a set of exmaples that use raycasting technology
 * @type {{mode: string, output: {path: string, libraryTarget: string, filename: string}, devtool: string, entry: {}, plugins: [], module: {rules: []}, target: string}}
 */
const exampleConfig = {
    mode: "development",
    entry: lsIndex('examples', 'index.js'),
    resolve: {
        alias: {
            libs: path.resolve(DIR_NAME, 'libs')
        }
    },
    output: {
        path: path.resolve(DIR_NAME, 'dist/examples'),
        libraryTarget: 'umd',
        filename: '[name].js',
    },
    devtool: 'source-map',
    module: {
        rules: [
        ]
    },
    plugins: [
    ],
    target: 'web'
};

module.exports = exampleConfig;
