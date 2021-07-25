const path = require('path');
const fs = require('fs');
const DIR_NAME = __dirname;

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
 * libraycaster.js
 * @type {{mode: string, output: {path: string, libraryTarget: string, filename: string}, devtool: string, entry: {libraycaster: string}, plugins: *[], module: {rules: *[]}, target: string}}
 */
const devConfig = require('./webpack.config.dev');

/**
 * Unit tests
 * @type {{mode: string, output: {path: string, libraryTarget: string, filename: string}, devtool: string, entry: {tests: string}, plugins: *[], module: {rules: *[]}, target: string}}
 */
const testConfig = require('./webpack.config.test');

/**
 * The map editor software
 * @type {{mode: string, output: {path: string, libraryTarget: string, filename: string, publicPath: string}, devtool: string, entry: {mapedit: string}, plugins: [VueLoader.VueLoaderPlugin], module: {rules: [{test: RegExp, use: string}, {test: RegExp, use: [string, string]}, {test: RegExp, loader: string, options: {limit: number}}]}, target: string}}
 */
const mapeditConfig = require('./webpack.config.mapedit');

/**
 * The game projects management website
 * @type {{mode: string, output: {path: string, libraryTarget: string, filename: string, publicPath: string}, devtool: string, entry: {website: string}, plugins: [VueLoader.VueLoaderPlugin], module: {rules: [{test: RegExp, use: string}, {test: RegExp, use: [string, string]}, {test: RegExp, loader: string, options: {limit: number}}]}, target: string}}
 */
const websiteConfig = require('./webpack.config.website');

/**
 * The demos
 * @type {{mode: string, output: {path: string, libraryTarget: string, filename: string}, devtool: string, entry: {}, plugins: [], module: {rules: []}, target: string}}
 */
const exampleConfig = require('./webpack.config.demos');

/**
 * The current game project
 * Only one game mauy be built at a time
 * Check ".env" file to select your game project location
 * @type {{mode: string, output: {path: string, libraryTarget: string, filename: string}, devtool: string, entry: {game: string}, plugins: [], module: {rules: []}, target: string}}
 */
const gameConfig = require('./webpack.config.game');

const polyfillConfig = require('./webpack.config.polyfills')

const CONFIG = [
    polyfillConfig,
    testConfig,
    exampleConfig,
    devConfig,
    mapeditConfig,
    websiteConfig,
    gameConfig
];

module.exports = CONFIG;
