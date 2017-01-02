var gulp = require('gulp');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var stream = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');
var del = require('del');
var rename = require('gulp-rename');
var pkg = require('./package.json');
var replace = require('gulp-replace');

const paths = {
  src: 'src',
  dist: 'dist',
  example: 'example'
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

// gulp.task('update:example', ['banner'], function () {
//   return gulp.src(`${paths.dist}/*`)
//     .pipe(gulp.dest(paths.example));
// });

/*
gulp.task('webpack-dev-server', function (callback) {
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = '#inline-source-map';
  myConfig.entry.example.unshift('webpack-dev-server/client?http://localhost:8080/'); // @see https://webpack.github.io/docs/webpack-dev-server.html#inline-mode-with-node-js-api

  new WebpackDevServer(webpack(myConfig), {
    contentBase: path.resolve(__dirname, 'example'),
    stats: {
      colors: true
    }
  }).listen(8080, 'localhost', function (err) {
    if (err) throw new gutil.PluginError('webpack-dev-server', err);
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
  });
});
*/


gulp.task('build', [
  'clean',
  'webpack',
  'minify:js',
  'banner',
  // 'update:example'
]);

// gulp.task('default', ['webpack-dev-server']);
gulp.task('default', ['build']);
