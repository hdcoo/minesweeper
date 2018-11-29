const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const BaseConfig = require('./webpack.base.config')();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {srcDir} = require('../lib/utils');

const ApiLevel = process.env.API_LEVEL || 'development';

module.exports = function () {
  return merge(
    BaseConfig,
    {
      devtool: 'source-map',
      mode: 'development',
      entry: [
        path.join(srcDir, 'index.js'),
        'webpack/hot/only-dev-server',
        'webpack-hot-middleware/client?reload=true'
      ],
      output: {
        path: '/dist',
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[name].[id].js'
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': '"development"',
          'process.env.API_LEVEL': `"${ApiLevel}"`
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: path.join(srcDir, 'view.hbs'),
        }),
      ],
      module: {
        rules: [
          {
            test: /\.vue$/,
            use: ['vue-loader']
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          },
          {
            test: /\.scss$/,
            use: ["style-loader", "css-loader", "sass-loader"]
          },
        ]
      }
    }
  );
};