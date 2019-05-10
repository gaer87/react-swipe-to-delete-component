'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  entry: {
    SwipeToDeleteComponent: [path.resolve(__dirname, 'src/js/main')],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    library: '[name]',
    libraryTarget: 'umd',
    filename: 'swipe-to-delete.min.js',
  },

  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: ['.js', '.jsx'],
  },

  externals: {
    'react': {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
    },
  },

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
  ],

  mode: 'production',
};

module.exports = config;
