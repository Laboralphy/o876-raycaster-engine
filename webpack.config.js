const path = require('path');
const fs = require('fs');
const GAME_FOLDER = 'game'; // game project directory
const DEV_CONFIG = false; // include dev examples or not ?

const devConfig = {
    mode: "development",
    entry: {
        libraycaster: path.resolve(__dirname, 'lib/src/index.js'),
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
    plugins: [],
    target: 'web'
};

const testConfig = {
    mode: "development",
    entry: {
        tests: path.resolve(__dirname, 'tests/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist/tests'),
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

const gameConfigFile = path.resolve(__dirname, GAME_FOLDER, 'webpack.config.js');
const gameConfig = !!fs.statSync(gameConfigFile)
    ? require(gameConfigFile)
    : null;

const CONFIG = [
    testConfig,
    exampleConfig,
    mapeditConfig,
    websiteConfig
];

if (!!gameConfig) {
    CONFIG.push(gameConfig);
}

if (DEV_CONFIG) {
    CONFIG.push(devConfig);
}

module.exports = CONFIG;
