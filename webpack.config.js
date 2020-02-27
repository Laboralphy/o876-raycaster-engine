const path = require('path');
const fs = require('fs');
const GAME_FOLDER = 'game'; // game project directory
const DEV_CONFIG = false; // include dev examples or not ?
const DIR_NAME = __dirname;

const devConfig = {
    mode: "development",
    entry: {
        libraycaster: path.resolve(DIR_NAME, 'lib/src/index.js'),
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

const testConfig = {
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

const mapeditConfig = require('./tools/mapedit/webpack.config');
const websiteConfig = require('./tools/website/webpack.config');

function getAllIndex(sSource, sEntry) {
    const sPath = path.resolve(DIR_NAME, sSource);
    const output = {};
    fs
        .readdirSync(sPath)
        .forEach(f => output[f] = path.resolve(sPath, f, sEntry));
    return output;
}



const exampleConfig = {
    mode: "development",
    entry: getAllIndex('examples', 'index.js'),
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


require('dotenv').config({ path: path.resolve(DIR_NAME, '.env') });

const gameConfig = {
    mode: "development",
    entry: {
        game: path.resolve(path.resolve(DIR_NAME, process.env.GAME_PATH, 'src/index.js')),
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
}

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
