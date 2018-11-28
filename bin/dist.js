#!/usr/bin/env node

const webpack = require('webpack');
const debug = require('debug')('Dist');
const getWebpackConfig = require('../webpack/webpack.pro.config');

const compiler = webpack(getWebpackConfig());

compiler.run((err, stats) => {
  if (err) {
    return debug(err)
  }
  //eslint-disable-next-line
  console.log(stats.toString({
    context: 'normal',
    colors: true,
    chunks: false
  }))
});