const webpack = require("webpack");
const {merge} = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const path = require('path');

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, './../app'),
        },
        compress: true,
        port: 1111
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: "[file].map"
        }),
    ]
});

// export devWebpackConfig
module.exports = new Promise((resolve, reject) => {
    resolve(devWebpackConfig)
});