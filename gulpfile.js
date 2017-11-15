'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var mqpacker = require('css-mqpacker');
var cssmin = require('gulp-cssmin');

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

var plumber = require('gulp-plumber');
var rename = require('gulp-rename');

var server = require('browser-sync').create();
var del = require('del');
var run = require('run-sequence');

gulp.task('style', function() {
  gulp.src('less/style.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer({browsers: [
        'last 2 versions'
      ]}),
      mqpacker({
        sort: false
      })
    ]))
    .pipe(gulp.dest('build/css'))
    .pipe(cssmin())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task('html:copy', function() {
  return gulp.src('*.html')
    .pipe(gulp.dest('build'));
});

gulp.task('html:update', ['html:copy'], function(done) {
  server.reload();
  done();
});

gulp.task('serve', ['style'], function() {
  server.init({
    server: 'build/'
  });

  gulp.watch('less/**/*.less', ['style']);
  gulp.watch('*.html', ['html:update']);
});

gulp.task('copy', function() {
  return gulp.src([
    'fonts/**/*.{woff,woff2}',
    'img/**',
    '*.html'
  ], {
    base: '.'
  })
    .pipe(gulp.dest('build'));
});


gulp.task('clean', function() {
  return del('build');
});

gulp.task('build', function(fn) {
  run(
    'clean',
    'copy',
    'style',
    fn
  );
});

