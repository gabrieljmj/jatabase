'use strict';

const gulp = require('gulp'),
  mocha = require('gulp-mocha');

// Mocha tests
gulp.task('tests', function () {
  return gulp.src('test/jatabase.js', {read: false})
    .pipe(mocha());
});

gulp.task('default', ['tests']);