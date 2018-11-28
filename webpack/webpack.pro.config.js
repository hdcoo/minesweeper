const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const BaseConfig = require('./webpack.base.config')();
const {srcDir} = require('../lib/utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const HtmlWebpackInlineSourcePlugin = require("butter-html-webpack-inline-source-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const PrerenderSPAPlugin = require('prerender-spa-plugin');
const {assignValueWithEnv} = require('../lib/utils');

const {NODE_ENV, API_LEVEL} = process.env;

module.exports = function() {
  return merge(
    BaseConfig,
    {
      mode: NODE_ENV,
      entry: path.join(srcDir, 'index.js'),
      output: {
        path: path.join(__dirname, '../dist'),
        publicPath: '//',
        filename: '[name].[contenthash:8].js',
        chunkFilename: '[name].[contenthash:8].js'
      },
      optimization: {
        runtimeChunk: 'single',
        splitChunks: {
          name: true,
          chunks(chunk) {
            return !/\w+\/fallback$/.test(chunk.name)
          },
          minChunks: 2,
          minSize: 1024 * 50,
          maxSize: 0,
          maxInitialRequests: 5,
          maxAsyncRequests: 5,
          cacheGroups: {
            default: false,
            butter: {
              test: /[\\/]node_modules[\\/]butter/,
              priority: 10
            },
            vendors: {
              test(chunks) {
                if(/[\\/]node_modules[\\/]butter/.test(chunks.resource)) {
                  return false
                }
                return /([\\/]node_modules[\\/])/.test(chunks.resource)
              },
              priority: 20
            }
          }
        }
      },
      plugins: [
        new CleanWebpackPlugin(['dist'], {
          root: process.cwd()
        }),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': `"${NODE_ENV}"`,
          'process.env.API_LEVEL': `"${API_LEVEL}"`
        }),
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash:8].css',
          chunkFilename: '[name].[contenthash:8].css'
        }),
        new OptimizeCSSAssetsPlugin({
          canPrint: false,
          cssProcessorOptions: {
            reduceIdents: false
          }
        }),
        new webpack.HashedModuleIdsPlugin(),
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: path.join(srcDir, 'view.hbs'),
        }),
        new HtmlWebpackInlineSourcePlugin()
      ],
      module: {
        rules: [
          {
            test: /\.vue$/,
            use: ['vue-loader']
          },
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader']
          },
          {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
          }
        ]
      },
      devtool: assignValueWithEnv({
        development: 'source-map',
        production: 'none',
        default: 'none'
      }),
    }
  );
};