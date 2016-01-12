var gulp = require('gulp');

gulp.task('copy-dependencies', function() {
    gulp.src('node_modules/requirejs/require.js')
        .pipe(gulp.dest('public_html/js/External'));
    gulp.src('node_modules/three/three.min.js')
        .pipe(gulp.dest('public_html/js/External'));
});

gulp.task('dev', ['copy-dependencies'], function() {
    // TODO: Add dependencies for tasks that will be performed while developing.
});

gulp.task('deploy', ['copy-dependencies'], function() {
    // TODO: Add dependencies for tasks needed to prepare the site for deployment.
});

gulp.task('default', ['dev'], function () {
    // Running just 'gulp' should run the dev tasks.
});
