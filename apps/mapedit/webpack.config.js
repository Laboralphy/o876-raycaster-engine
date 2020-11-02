const path = require('path');
const {VueLoaderPlugin} = require('vue-loader');

const rcmapeditConfig = {
    mode: "development",
    resolve: {
        alias: {
            libs: path.join(__dirname, '../../libs')
        }
    },
    entry: {
        mapedit: path.join(__dirname, 'src/index.js'),
    },
    output: {
        path: path.join(__dirname, 'app'),
        libraryTarget: 'umd',
        filename: '[name].js',
        publicPath: './app/'
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

module.exports = rcmapeditConfig;
