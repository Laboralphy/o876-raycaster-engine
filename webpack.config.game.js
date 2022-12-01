const {VueLoaderPlugin} = require('vue-loader');
const path = require('path');

const DIR_NAME = __dirname

/**
 * The current game project
 * Only one game may be built at a time
 * Check ".env" file to select your game project location
 * @type {{mode: string, output: {path: string, libraryTarget: string, filename: string}, devtool: string, entry: {game: string}, plugins: [], module: {rules: []}, target: string}}
 */
module.exports = {
    mode: 'development',
    resolve: {
        alias: {
            libs: path.resolve(DIR_NAME, 'libs')
        }
    },
    entry: {
        game: path.resolve(DIR_NAME, process.env.RCGDK_GAME_PATH, 'src/index.js')
    },
    output: {
        path: path.resolve(DIR_NAME, process.env.RCGDK_GAME_PATH, 'dist'),
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
