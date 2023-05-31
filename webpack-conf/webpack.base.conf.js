const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PATHS = {
    src: path.join(__dirname, '../app'),
    dist: path.join(__dirname, '../dist'),
    publicPath: '/dist'
};

const PAGES_DIR = PATHS.src;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));


module.exports = {
    externals: {
        paths: PATHS
    },
    target: "web",
    // точка входа
    entry: {
        main: './app/scripts/main.js'
    },
    // выход
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, '../dist')
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendors',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    module: {
        rules: [{
            // JS Babel
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: '/node_modules/',
        },
        {
            // PUG
            test: /\.pug$/,
            loader: 'pug-loader'
        },
        {
            // SCSS
            test: /\.scss$/,
            use: [
                'style-loader',
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {sourceMap: true}
                },
                {
                    loader: 'postcss-loader',
                    options: {sourceMap: true, config: {path: 'app/scripts/postcss.config.js'}}
                },
                {
                    loader: 'sass-loader',
                    options: {sourceMap: true}
                }
            ]
        },
        {
            // CSS
            test: /\.css$/,
            use: [
                'style-loader',
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {sourceMap: true}
                },
                {
                    loader: 'postcss-loader',
                    options: {sourceMap: true, config: {path: 'app/scripts/postcss.config.js'}}
                }
            ]
        },
        {
            // images
            test: /\.(png|jpg|webp|gif|svg|ico)$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
            }
        },
        {
            // fonts.css
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: '/fonts',
            }
        },]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: PATHS.src + '/images', to: PATHS.dist + '/images'},
                {from: PATHS.src + '/favicon.ico', to: PATHS.dist}
            ]
        }),
        ...PAGES.map(page => new HtmlWebpackPlugin({
            template: `${PAGES_DIR}/${page}`,
            filename: `./${page.replace(/\.pug/,'.html')}`
            // favicon: PATHS.src + '/favicon.ico?v=2'
        }))
    ],
};