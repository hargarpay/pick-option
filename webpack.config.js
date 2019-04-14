const path = require('path');
const TSLintPlugin = require('tslint-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isDevelopment = false;
const filepath = isDevelopment ? '[name].js' : '[name].min.js';
module.exports = {
    mode: isDevelopment ?  'development' : 'production',
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    entry:{
        main: [
            "./src/index.ts",
            "./src/sass/main.scss"
        ],
        polyfills:  [
            'element-closest',
            'core-js/modules/es6.array.from.js'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: filepath
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                       loader: 'ts-loader',
                    //    options: {
                    //        getCustomTransformers: path.join(__dirname, './webpack.ts-transformer.js')
                    //    }
                    }
                ],
                exclude: /node_modules/,

            },
            {
                test: /\.s?(a|c)ss$/,
                loaders: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: isDevelopment ? '[name].css' : '[name].min.css',
          chunkFilename: isDevelopment ? '[id].css' : '[id].min.css'
        }),
        new TSLintPlugin({
            files: ['./src/**/*.ts']
        })
    ]
}