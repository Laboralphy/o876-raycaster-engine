const path = require('path');

const DIR_NAME = __dirname

/**
 * The unit tests webpack config.
 * This config will produce a all-in-one unit test file, that runs fine with pure javascript libraries (only "import" ; no require() function)
 * @type {{mode: string, output: {path: string, libraryTarget: string, filename: string}, devtool: string, entry: {tests: string}, plugins: [], module: {rules: []}, target: string}}
 */
module.exports = {
    mode: "development",
    entry: {
        tests: path.resolve(DIR_NAME, 'tests/index.js')
    },
    output: {
        path: path.resolve(DIR_NAME, 'dist/tests'),
        libraryTarget: 'commonjs2',
        filename: '[name].js'
    },
    devtool: 'source-map',
    module: {
        rules: [
        ]
    },
    plugins: [
    ],
    target: 'node'
};
