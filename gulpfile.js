const gulp = require('gulp');
const webpack = require('webpack');
const stream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const del = require('del');
const pkg = require('./package.json');
const replace = require('gulp-replace');

const paths = {
  src: 'src',
  dist: 'dist',
};

const clean = () => del([paths.dist])

const wp = () => gulp.src(paths.src)
  .pipe(stream(webpackConfig))
  .pipe(gulp.dest(paths.dist));

const banner = () => {
  const comment =
`/*!
 * ${pkg.name[0].toUpperCase() + pkg.name.slice(1)} v${pkg.version}
 * ${pkg.description}
 * ${pkg.homepage}

 * Copyright ${new Date().getFullYear()}, ${pkg.author}
 * Released under the ${pkg.license} license.
 */
`;

  return gulp.src(`${paths.dist}/*`)
    .pipe(replace(/^/, comment))
    .pipe(gulp.dest(paths.dist));
}

const build = gulp.series(clean, wp, banner);
exports.build = build;
exports.default = gulp.series(build);
