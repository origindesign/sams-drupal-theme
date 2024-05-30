'use strict';

const gulp = require('gulp'); // Main Task Runner
const sass = require('gulp-sass')(require('sass')); // Sass tool for gulp
const sassGlob = require('gulp-sass-glob'); // Allow to use wildcard in import sass file
const concat = require('gulp-concat'); // Concatenate files (used for generating one single JS file for instance)
const uglify = require('gulp-uglify'); // Compile JS
const cache = require('gulp-cached');
const gulpIf = require('gulp-if'); // Used to create conditions for checking if a file is js, css or html
const sourcemaps = require('gulp-sourcemaps'); // Allow better debugging in browser
const sasslint = require('gulp-sass-lint'); // Clean CSS syntax writing (see .sass-lint.yml to check the rules)
const eslint = require('gulp-eslint'); // Clean JS syntax writing
const autoprefixer = require('autoprefixer'); // Add autoprefixer to css to write css without need of browser prefix
const postcss = require('gulp-postcss'); // Used to trigger autoprefixer
const del = require('del'); // Cleaning up generated files
const babel = require('gulp-babel'); // Javascript Compiler
const runSequence = require('gulp4-run-sequence') // Sequence runner to combine tasks in between them
const cssnano = require('gulp-cssnano'); // Minify css


// Set asset paths.
const paths = {
    scss: [
        './components/**/*.scss',
        './scss/**/*.scss'
    ],
    js: {
        default: './js/default/*.js' ,
        all: './js/**/*.js',
        custom: './js/*.js'
    }
};



// Cleaning up generated files
gulp.task('clean:dist', async function() {
    return del.sync('dist');
});


// Validate Sass syntax
gulp.task('sass:lint', function() {
    return gulp.src(paths.scss)
        .pipe(sasslint())
        .pipe(sasslint.format())
        .pipe(sasslint.failOnError());
});


// Validate JS syntax
gulp.task('javascript:lint', function() {
    return gulp.src([paths.js.all,'!node_modules/**'])
        .pipe(cache('linting'))
        .pipe(eslint({fix:true}))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});


// Optimizing javascript files
gulp.task('javascript', function() {
    return gulp.src(paths.js.default)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(concat('all.min.js'))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/'));
});


// Loop custom js and minify
gulp.task('javascript:custom', function() {
    return gulp.src(paths.js.custom)
        .pipe(cache('custom'))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/'));
});


// Compile sass into css
gulp.task('sass', function() {
    return gulp.src('./scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/'));
});


// Watch sass and js files
gulp.task('watch', function () {
    gulp.watch(paths.scss, gulp.series('sass', 'sass:lint'));
    gulp.watch(paths.js.all, gulp.series('javascript', 'javascript:custom', 'javascript:lint'));
});


// Compile sass and js files
gulp.task('compile', function (callback) {
    runSequence('clean:dist', 'sass', 'sass:lint', 'javascript', 'javascript:custom', 'javascript:lint', callback);
});


// Default Task (clean and watch)
gulp.task('default', function(callback) {
    runSequence('watch', callback);
});
