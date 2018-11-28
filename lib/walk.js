const fs = require('fs');
const path = require('path');
const {isFunction} = require('./utils');

const contained = function (from, to) {
  const relative = path.relative(from, to);
  return relative !== '..' && !/^\.\.\//.test(relative)
};

const walk = function(from, to, callback) {
  if(contained(from, to)) {
    isFunction(callback) && callback(to);
    return walk(from, path.dirname(to), callback)
  }
};

module.exports = function (from, to, callback) {
  const toStat = fs.lstatSync(to);
  const fromStat = fs.lstatSync(from);
  
  if(!toStat.isDirectory()) {
    throw new Error(`${to} is not a directory`)
  }
  if(!fromStat.isDirectory()) {
    throw new Error(`${from} is not a directory`)
  }
  if(!contained(from, to)) {
    throw new Error(`${to} is not contained by ${from}`)
  }
  
  walk(from, to, callback)
};