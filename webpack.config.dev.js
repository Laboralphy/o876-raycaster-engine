const path = require('path');

const DIR_NAME = __dirname;

/**
 * The main library.
 * This webpack config will produce a libraycaster.js file, for using with full html, non-webpack compliant project...
 * ... Not a recommanded way to create game with this technology.
 * @type {{mode: string, output: {path: string, libraryTarget: string, filename: string}, devtool: string, entry: {libraycaster: string}, plugins: [], module: {rules: []}, target: string}}
 */
module.exports = {
    mode: "development",
    resolve: {
        alias: {
            libs: path.resolve(DIR_NAME, 'libs')
        }
    },
    entry: {
        libraycaster: path.resolve(DIR_NAME, 'libs/index.js'),
    },
    output: {
        path: path.resolve(DIR_NAME, 'dist'),
        libraryTarget: 'umd',
        filename: '[name].js'
    },
    devtool: 'source-map',
    module: {
        rules: [
        ]
    },
    plugins: [],
    target: 'web'
};
