const path = require('path');

exports.isFunction = function(fn) {
  return typeof fn === 'function'
};

exports.isString = function(value) {
  return typeof value === 'string'
};

exports.isObject = function (value) {
  return !!value && typeof value === 'object' && !Array.isArray(value)
};

exports.rootDir = process.cwd();

exports.srcDir = path.join(exports.rootDir, 'src');

exports.assignValueWithEnv = function (values) {
  const env = process.env.NODE_ENV;
  const value = values[env] || values.default;
  if(!value) {
    throw new Error(`${values} doesn't match NODE_ENV`);
  }
  return value
};