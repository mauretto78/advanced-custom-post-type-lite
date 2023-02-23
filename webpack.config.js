const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    mode: 'production', //development production
    entry: {
        "app.min":"./assets/src/App/index.js",
        "block.min":"./assets/src/Gutemberg/index.js",
        "theme.min":"./assets/src/theme/index.js",
    },
    devtool: isProduction ? 'source-map' : 'eval',
    output: {
        path: path.join(__dirname, './assets/build'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /.s?css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                include: [
                    path.resolve(__dirname, './assets/src/App'),
                    path.resolve(__dirname, './assets/src/Gutemberg')
                ],
                options: {
                    cacheDirectory: true,
                    presets: [["env", "react"]],
                    plugins: ["transform-class-properties"]
                }
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new UglifyJsPlugin({
                include: /\.min\.js$/
            })
        ],
    },
    plugins: [
       // new BundleAnalyzerPlugin(),
        new MiniCssExtractPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production') //development production
            }
        }),
    ],
    watchOptions: {
        ignored: /node_modules/
    }
};