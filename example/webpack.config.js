'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  entry: {
    example: [path.resolve(__dirname, 'src/js/main')],
  },

  output: {
    filename: 'bundle.js',
    path: __dirname,
  },

  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: ['.js', '.jsx'],
    alias: {
      'react-swipe-to-delete-component': path.resolve(__dirname, '../src/js/main'),
    },
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'swipe-to-delete.css',
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
  ],

  mode: 'development',

  devServer: {
    contentBase: __dirname,
    historyApiFallback: true,
    inline: true,
    port: 8080,
    stats: {
      cached: false,
    },
  },
};

module.exports = config;
