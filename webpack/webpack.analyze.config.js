const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const webpackProConfig = require('./webpack.pro.config');

module.exports = function (collection = {}) {
  const config = webpackProConfig(collection);
  return merge(config, {
    plugins: [
      new BundleAnalyzerPlugin(),
    ]
  })
};