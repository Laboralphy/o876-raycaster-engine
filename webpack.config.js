const path = require('path');

const devConfig = {
    mode: "development",
    entry: {
        libraycaster: path.resolve(__dirname, 'src/Engine.js'),
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
        tests: path.resolve(__dirname, 'tests/Engine.js')
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


const exampleConfig = {
    mode: "development",
    entry: {
        devtest: path.resolve(__dirname, 'examples/devtest/Engine.js'),
        engtest: path.resolve(__dirname, 'examples/engtest/Engine.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        filename: 'example-[name].js',
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

module.exports = [devConfig, testConfig, exampleConfig];
