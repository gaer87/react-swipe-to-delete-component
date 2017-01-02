'use strict';

let path = require('path');

let config = {
	resolve: {
		modulesDirectories: ['node_modules'],
		extensions: ['', '.js']
	},

	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.scss$/,
				loader: 'style!css!sass'
			}
		]
	}
};

module.exports = config;
