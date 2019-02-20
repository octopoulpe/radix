/* jshint node: true */
'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
// var uglify = require('gulp-uglify');
var stringify = require('stringify');
var watchify = require('watchify');
var assign = require('lodash.assign');
var gutil = require('gulp-util');
var webserver = require('gulp-webserver');
var vueify = require('vueify');
var objify = require('./browserify-obj');
var envify = require('envify/custom');

var config = {
    buildDir: './app/build',
    jsMain: './src/main.js',
    jsMin: './app.min.js',
};

var opts = assign({}, watchify.args, {
  entries: config.jsMain,
  fullPaths: true,
  // debug: true,
});
var wBundler = watchify(
    browserify(opts)
    .transform(
        stringify,
        {appliesTo: {includeExtensions: ['.glsl'], }, }
    )
    .transform(
        objify,
        {appliesTo: {includeExtensions: ['.obj'], }, }
    )
    .transform(
        vueify,
        {appliesTo: {includeExtensions: ['.vue'], }, }
    )
    .transform(
        {global: true, },
        envify({NODE_ENV: 'debug', })
    )
);

function bundle () {
    return wBundler
    .bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(config.jsMin))
    .pipe(buffer())
    // do not uglify because it alter the constructor name (which is used)
    //.pipe(uglify({compress: false}))  // {compress: false} because sourcemaps work only with that
    .pipe(gulp.dest(config.buildDir));
}

gulp.task('js', bundle);
wBundler.on('update', bundle);
wBundler.on('log', gutil.log);

gulp.task('webserver', function() {
  return gulp.src('app')
  .pipe(webserver({}));
});

gulp.task(
    'default',
    ['js', 'webserver', ]
);
