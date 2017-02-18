var gulp = require('gulp'),
    concatCss = require('gulp-concat-css'),
    cleanCss = require('gulp-clean-css'),
    concatJs = require('gulp-concat'),
    uglyflyJs = require('gulp-uglyfly');

gulp.task('minify', function(){
    minimizeCss();
    minimizeJs();
});

function minimizeJs() {
    gulp.src('src/*.js')
        .pipe(concatJs('carousel.min.js'))
        .pipe(uglyflyJs())
        .pipe(gulp.dest('dist/'));
}

function minimizeCss() {
    gulp.src('src/*.css')
        .pipe(concatCss('carousel.min.css'))
        .pipe(cleanCss())
        .pipe(gulp.dest('dist/'));
}