'use strict';

let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

let config = {
  entry: {
    example: [path.resolve(__dirname, 'src/js/main')],
  },

  output: {
    filename: 'bundle.js',
    path: __dirname,
  },

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx'],
    alias: {
      'react-swipe-to-delete-component': path.resolve(__dirname, '../src/js/main')
    }
  },

  debug: true,

  devtool: 'source-map',

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
  ],

  devServer: {
    colors: true,
    contentBase: __dirname,
    historyApiFallback: true,
    // hot: true,
    inline: true,
    port: 8080,
    progress: true,
    stats: {
      cached: false,
    }
  }
};

module.exports = config;
