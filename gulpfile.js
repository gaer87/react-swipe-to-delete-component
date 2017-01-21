var gulp = require('gulp');
var uglify = require('gulp-uglify');
var path = require('path');
var webpack = require('webpack');
var stream = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');
var del = require('del');
var rename = require('gulp-rename');
var pkg = require('./package.json');
var replace = require('gulp-replace');

const paths = {
  src: 'src',
  dist: 'dist'
};

gulp.task('clean', function () {
  return del([paths.dist]);
});

gulp.task('webpack', ['clean'], function () {
  return gulp.src(paths.src)
    .pipe(stream(webpackConfig))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('minify:js', ['webpack'], function () {
  return gulp.src(`${paths.dist}/${webpackConfig.output.filename}`)
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('banner', ['minify:js'], function () {
  var comment =
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
});

gulp.task('build', [
  'clean',
  'webpack',
  'minify:js',
  'banner'
]);

gulp.task('default', ['build']);
