require('@babel/register')({
  presets: ['@babel/preset-env']
});

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const {srcDir} = require('./utils');
const {getConfig} = require('./customConfig');

const hasEntry = function(context) {
  return fs.existsSync(path.join(context, 'index.js'))
};

const getContext = function(suffix, page) {
  return path.join(srcDir, `${suffix}/${page}`)
};

const getMultiPages = function(context) {
  try {
    const dirs = glob.sync(path.join(context, '/*/index.js'));
    return dirs.map(dir => {
      const splits = dir.split('/');
      return splits.slice(splits.length - 3, splits.length - 1).join('/')
    })
  } catch (e) {
    return []
  }
};

exports.getEntries = function (pages) {
  return pages.reduce((accumulator, page) => {
    const context = getContext('pages', page);
    if(hasEntry(context)) {
      return accumulator.concat(getConfig(page, context))
    }
    return accumulator.concat(exports.getEntries(getMultiPages(context)))
  }, [])
};

exports.getAllEntries = function () {
  const pages = glob.sync(path.join(srcDir, 'pages/*')).map(path => {
    const splits = path.split('/');
    return splits[splits.length - 1]
  });
  return exports.getEntries(pages)
};

exports.mergeEntries = function (entries) {
  return entries.reduce((accumulator, entry) => {
    const {extraWebpackPaths} = entry;
    let collection = accumulator[extraWebpackPaths];
    if(!collection) {
      collection = accumulator[extraWebpackPaths] = [];
    }
    collection.push(entry);
    return accumulator
  }, {})
};