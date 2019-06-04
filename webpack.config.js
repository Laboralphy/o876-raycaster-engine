const path = require('path');
const fs = require('fs');


const devConfig = {
    mode: "development",
    entry: {
        libraycaster: path.resolve(__dirname, 'src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        filename: '[name].js'
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

const testConfig = {
    mode: "development",
    entry: {
        tests: path.resolve(__dirname, 'tests/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
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

const mapeditConfig = require('./tools/mapedit/webpack.config');

const websiteConfig = require('./tools/website/webpack.config');

function getExampleList() {
    const output = {};
    fs
        .readdirSync('./examples')
        .forEach(f => output[f] = path.resolve(__dirname, 'examples', f, 'index.js'));
    return output;

}

const exampleConfig = {
    mode: "development",
    entry: getExampleList(),
    output: {
        path: path.resolve(__dirname, 'dist/examples'),
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

module.exports = [devConfig, testConfig, exampleConfig, mapeditConfig, websiteConfig];
