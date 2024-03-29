const path = require('path');
const {VueLoaderPlugin} = require('vue-loader');
const webpack = require('webpack');

const websiteConfig = {
    mode: "development",
    resolve: {
        alias: {
            libs: path.join(__dirname, '/libs')
        }
    },
    entry: {
        website: path.join(__dirname, 'apps/website/src/index.js'),
    },
    output: {
        path: path.join(__dirname, 'dist/website'),
        libraryTarget: 'umd',
        filename: '[name].js',
        publicPath: './dist/website/'
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

module.exports = websiteConfig;
