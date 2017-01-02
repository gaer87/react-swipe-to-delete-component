'use strict';

let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

let config = {
  entry: {
    example: [path.resolve(__dirname, 'src/js/main')],
  },

  output: {
    filename: 'bundle.js'
  },

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx'],
    alias: {
      'react-swipe-to-delete-component': path.resolve(__dirname, '../src/js/main')
      // 'react-swipe-to-delete-component': path.resolve(__dirname, '../dist/swipe-to-delete')
    }
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass?indentType=tab&indentWidth=1')
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('swipe-to-delete.css')
  ]
};

module.exports = config;
