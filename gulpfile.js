var gulp = require("gulp"),
    fs = require("fs"),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

var rootPath = './';
var allJsPaths = [
    rootPath + 'src/fImageView.js',
    rootPath + 'src/utils.js',
    rootPath + 'src/ieRotate.js',
    rootPath + 'src/fimage.js',
    rootPath + 'src/fImagePanel.js'
];
gulp.task('buildjs', function () {
    return gulp.src(allJsPaths)
        .pipe(concat('fImageView.js'))
        .pipe(gulp.dest(rootPath + 'dist/'));
});
gulp.task('buildjsmin', function () {
    return gulp.src(allJsPaths)
        .pipe(uglify())
        .pipe(concat('fImageView.min.js'))
        .pipe(gulp.dest(rootPath + 'dist/'));
});

gulp.task('build', ['buildjs', 'buildjsmin'], function () {
    gulp.watch(allJsPaths, ['build']);
});
