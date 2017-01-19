'use strict';

let path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');

let config = {
  entry: {
    SwipeToDeleteComponent: [path.resolve(__dirname, 'src/js/main')]
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    library: '[name]',
    libraryTarget: 'umd',
    filename: 'swipe-to-delete.js'
  },

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx']
  },

  externals: {
    'react': {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom'
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
