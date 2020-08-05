const {VueLoaderPlugin} = require('vue-loader');

const path = require('path');
const fs = require('fs');
const DEV_CONFIG = false; // include dev examples or not ?
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
 * checks if .env file exists and loads it
 * @throws Error if file doest not exists
 */
function loadEnvFile() {
    try {
        const sEnvPath = path.resolve(DIR_NAME, '.env');
        fs.statSync(sEnvPath);
        require('dotenv').config({ path: sEnvPath });
    } catch (e) {
        throw new Error('.env file not found.');
    }
}

loadEnvFile();

/**
 * The main library
 * @type {{mode: string, output: {path: string, libraryTarget: string, filename: string}, devtool: string, entry: {libraycaster: string}, plugins: [], module: {rules: []}, target: string}}
 */
const devConfig = {
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

/**
 * The unit tests
 * @type {{mode: string, output: {path: string, libraryTarget: string, filename: string}, devtool: string, entry: {tests: string}, plugins: [], module: {rules: []}, target: string}}
 */
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

/**
 * The map editor software
 * @type {{mode: string, output: {path: string, libraryTarget: string, filename: string, publicPath: string}, devtool: string, entry: {mapedit: string}, plugins: [VueLoader.VueLoaderPlugin], module: {rules: [{test: RegExp, use: string}, {test: RegExp, use: [string, string]}, {test: RegExp, loader: string, options: {limit: number}}]}, target: string}}
 */
const mapeditConfig = require('./mapedit/webpack.config');

/**
 * The game projects management website
 * @type {{mode: string, output: {path: string, libraryTarget: string, filename: string, publicPath: string}, devtool: string, entry: {website: string}, plugins: [VueLoader.VueLoaderPlugin], module: {rules: [{test: RegExp, use: string}, {test: RegExp, use: [string, string]}, {test: RegExp, loader: string, options: {limit: number}}]}, target: string}}
 */
const websiteConfig = require('./website/webpack.config');


/**
 * The examples
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


/**
 * The current game project
 * Only one game mauy be built at a time
 * Check ".env" file to select your game project location
 * @type {{mode: string, output: {path: string, libraryTarget: string, filename: string}, devtool: string, entry: {game: string}, plugins: [], module: {rules: []}, target: string}}
 */
const gameConfig = {
    mode: 'development',
    resolve: {
        alias: {
            libs: path.resolve(DIR_NAME, 'libs')
        }
    },
    entry: {
        game: path.resolve(DIR_NAME, process.env.GAME_PATH, 'src/index.js')
    },
    output: {
        path: path.resolve(DIR_NAME, process.env.GAME_PATH, 'dist'),
        libraryTarget: 'umd',
        filename: '[name].js'
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    limit: 10000
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    target: 'web'
};

const CONFIG = [
    testConfig,
    exampleConfig,
    mapeditConfig,
    websiteConfig,
    gameConfig
];

if (DEV_CONFIG) {
    CONFIG.push(devConfig);
}

module.exports = CONFIG;
