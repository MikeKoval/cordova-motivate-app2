var lr = require('tiny-lr'),
    commonjs = require('rollup-plugin-commonjs'),
    resolve = require('rollup-plugin-node-resolve'),
    rollup = require('gulp-rollup'),
    gulp = require('gulp'),
    babel = require('gulp-babel'),
    server = lr();

function build() {
    return gulp.src("www/assets/js/init.js", {read: false})
        .pipe(rollup({
            sourceMap: true,
            plugins: [resolve({jsnext: true}), commonjs()]
        }))
        .pipe(babel({presets: ['es2015']}))
        .pipe(gulp.dest('www/app/'));
}

gulp.task('build', build);

gulp.task('watch', function() {
    gulp.run('build');

    server.listen(35729, function(err) {
        if (err) return console.log(err);

        gulp.watch('www/assets/js/**/*', function() {
            gulp.run('build');
        });
    });
});