const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const sassToCSS = require("svelte-preprocess");
const path = require('path');
const devMode = process.env.NODE_ENV !== 'production';

const minimizer = (!devMode) ? [
    new OptimizeCSSAssetsPlugin({}),
    new UglifyJsPlugin({})
] : [];


module.exports = {
    entry: {
        client: './src/index.js'
    },
    module: {
        rules: [
            {test: /\.(js|jsx)$/, exclude: /node_modules/, use: ['babel-loader']},

            {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader?name=fonts/[name].[ext]'},

            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        preprocess: sassToCSS()
                    }
                }
            },

            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto',
                loader: 'babel-loader'
            },

            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]"
            },

            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[name].[ext]'
            },

            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=fonts/[name].[ext]'
            },

            {test: /\.(jpe?g|png|gif)$/i, loader: 'file-loader?name=images/[name].[ext]'},

            {test: /\.ico$/, loader: 'file-loader?name=[name].[ext]'},

            {
                test: /module\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            modules: true
                        }
                    },
                ]
            },

            {
                test: /\.(sa|sc|c)ss$/,
                exclude: [
                    /module\.(sa|sc|c)ss$/
                ],
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ]
            },

            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: [
                    /node_modules/,
                    '/**/*.test.tsx',
                    '/**/*.test.ts'
                ],
            },
        ]
    },
    resolve: {
        alias: {
            svelte: path.resolve('node_modules', 'svelte')
        },
        extensions: ['.mjs', '.js', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main']
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: devMode ? 'scripts/[name].bundle.js' : 'scripts/[name].[hash].bundle.js',
    },

    //split of the bundle
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    name: 'vendor',
                    test: /\/node_modules\//,
                    enforce: true
                }
            }
        },

        minimizer: minimizer
        // runtimeChunk: true,
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),

        //for adding automatically js files include on index.html
        new HtmlWebpackPlugin({
            template: 'src/index.ejs',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            },
            inject: true
        }),

        //for extracting css/scss code and create bundle.css
        new MiniCssExtractPlugin({
            filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css',
            chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[hash].css',
        })
    ],
    devServer: {
        host: '0.0.0.0',
        hot: true,
        inline: true,
        port: 3000,
        disableHostCheck: true,
        historyApiFallback: true,
        overlay: {
            errors: true,
            warning: true
        }
    }
};
