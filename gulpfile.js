'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const del = require('del');
const runSequence = require('run-sequence');
const tsc = require('gulp-typescript');
const tslint = require('gulp-tslint');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const tsify = require('tsify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('watch', ['browserSync', 'sass', 'typescript'], function() {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/ts/**/*.ts', ['typescript']);

  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  });
});

gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS files
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
    // Can add image minification here
    .pipe(gulp.dest('dist/img'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('favicon', function() {
  return gulp.src('app/favicon.ico')
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('typescript', function() {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['app/ts/main.ts'],
    cache: {},
    packageCache: {}
  })
  .plugin(tsify, {
    allowSyntheticDefaultImports: true,
    noImplicitAny: true
  })
  .bundle()
  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest("app/js"));
});

gulp.task('build', function(callback) {
  runSequence('clean:dist',
    ['sass', 'typescript'],
    ['useref', 'images', 'fonts', 'favicon'],
    callback
  );
});

gulp.task('default', function(callback) {
  runSequence(['sass', 'typescript', 'browserSync', 'watch'],
    callback
  );
});
