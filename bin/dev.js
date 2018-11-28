#!/usr/bin/env node

const ip = require('ip');
const logger = require('morgan');
const express = require('express');
const webpack = require('webpack');
const debug = require('debug')('Dev');
const bodyParser = require('body-parser');
const getWebpackConfig = require('../webpack/webpack.dev.config');

const app = express();
const compiler = webpack(getWebpackConfig());

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: '/',
  inline: true,
  hot: true,
  logLevel: 'info'
});

const hotMiddleware = require('webpack-hot-middleware')(compiler);

app.use(devMiddleware);
app.use(hotMiddleware);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = app.listen(4000, function(err) {
  if (err) {
    return;
  }
  debug(`Listening at http://${ip.address()}:4000`)
});