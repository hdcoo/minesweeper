const path = require('path');
const {srcDir} = require('../lib/utils');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = function () {
  return {
    entry: {},
    
    output: {},
    
    resolve: {
      alias: {
        assets: path.join(srcDir, 'assets'),
        components: path.join(srcDir, 'components'),
        common: path.join(srcDir, 'common')
      },
      extensions: [".js", ".json", ".vue", ".scss"]
    },
    
    module: {
      rules: [
        {
          test: /\.hbs$/,
          use: ['handlebars-loader']
        },
        {
          test: /\.js$/,
          exclude(input) {
            return /node_modules/.test(input.replace(/node_modules(\/|\\)butter/g, 'nm/butter'))
          },
          use: ['babel-loader']
        },
        {
          test: /\.(jpg|png|svg|otf|gif|ttf|TTF|mp4)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 5000,
                name: "assets/[name].[ext]"
              }
            }
          ]
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: {
                interpolate: true,
                attrs: [
                  "img:src",
                  "video:src",
                  "video:poster",
                  "img:data-mousedown-src",
                  "img:data-mouseup-src"
                ]
              }
            }
          ]
        }
      ]
    },
    
    plugins: [
      new VueLoaderPlugin()
    ]
  }
};