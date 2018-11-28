const fs = require('fs');
const path = require('path');
const walk = require('./walk');
const {rootDir, assignValueWithEnv, isString, isFunction, isObject} = require('./utils');
const _ = require('lodash');
const assetsParser = require('./assetsParser');

/**
 * 获取所有配置
 * @param {String} context - 项目所在目录
 * @returns {Array.<{filename: String, viewData: Object, custom: Object, webpack: Object}>}
 * */
function getConfigs(context) {
  try {
    let configs = [];
    walk(rootDir, context, dir => {
      const filename = path.join(dir, '.projectrc.js');
      if(!fs.existsSync(filename)) {
        return
      }
      try {
        const config = require(filename);
        configs.unshift({
          filename,
          viewData: Object.assign({}, config.viewData),
          custom: Object.assign({}, config.default),
          webpack: config.webpack
        })
      } catch (e) {
        //eslint-disable-next-line
        console.error(`Something wrong with ${filename}`, e.message)
      }
    });
    return configs
  } catch (e) {
    return []
  }
}

/**
 * 合并配置
 * @param {Array} configs - 配置列表
 * @returns {Object.<{group: String, viewData: Object, custom: Object, webpackConfigs: Array}>}
 * */
function mergeConfigs(configs) {
  const config = configs.reduce((accumulator, config) => {
    config.custom.group && isString(config.custom.group) && accumulator.group.push(config.custom.group);
    accumulator.viewData = _.merge(accumulator.viewData, config.viewData);
    accumulator.custom = _.mergeWith(accumulator.custom, config.custom, (target, source) => {
      if(_.isArray(target)) {
        return [...new Set([...target, ...source])]
      }
    });
    if(isFunction(config.webpack)) {
      accumulator.webpackConfigs.push({
        identifier: config.filename,
        config: config.webpack
      })
    } else if(isObject(config.webpack)) {
      accumulator.webpackConfigs.push({
        identifier: config.filename,
        config: config.webpack.config || {},
        customizeArray: config.webpack.customizeArray || (() => undefined),
        customizeObject: config.webpack.customizeObject || (() => undefined),
      });
    }
    return accumulator
  }, {group: [], viewData: {}, custom: {}, webpackConfigs: []});
  if(!config.group.length) {
    config.group = 'default'
  } else {
    config.group = config.group.join(',');
  }
  return config
}

/**
 * 根据 identifier 去重合并 webpack 配置
 * @param {Array} targets - 目标
 * @param {Array} sources - 源
 * @returns {Array.<{identifier: String, customizeArray: Function, customizeObject: Function, config: Object}>}
 * */
function mergeWebpackConfigs(targets, sources) {
  return sources.reduce((targets, source) => {
    for(let target of targets) {
      if(target.identifier === source.identifier) {
        return targets
      }
    }
    targets.push(source);
    return targets
  }, targets)
}

exports.getConfig = function (page, context) {
  const config = mergeConfigs(getConfigs(context));
  const [projectName, pageName = 'index'] = page.split('/');
  if(_.isArray(config.custom.scripts)) {
    config.custom.scripts = config.custom.scripts.map(script => assetsParser(script, {
      basePath: '/js',
      ext: assignValueWithEnv({
        production: '.min.js',
        development: '.js',
        default: '.min.js'
      })
    }))
  }
  if(_.isArray(config.custom.css)) {
    config.custom.css = config.custom.css.map(stylesheet => assetsParser(stylesheet, {
      basePath: '/css',
      ext: assignValueWithEnv({
        production: '.min.css',
        development: '.css',
        default: '.min.css'
      })
    }))
  }
  return Object.assign(config, {
    projectName,
    pageName,
    context,
    entryName: `${projectName}/${pageName}`,
    entryPath: path.join(context, 'index.js')
  })
};

exports.mergeOverPages = function (configs) {
  return configs.reduce((collection, config) => {
    let group = collection[config.group];
    const {viewData, custom, webpackConfigs} = config;
    if(!group) {
      collection[config.group] = group = {
        pageConfigs: [],
        webpackConfigs: []
      };
    }
    group.pageConfigs.push({
      viewData,
      custom,
      projectName: config.projectName,
      pageName: config.pageName,
      context: config.context,
      entryName: config.entryName,
      entryPath: config.entryPath
    });
    group.webpackConfigs = mergeWebpackConfigs(group.webpackConfigs, webpackConfigs);
    return collection
  }, {})
};