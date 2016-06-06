var gulp = require('gulp');

gulp.task('copy-dependencies', function() {
    var sources = ['node_modules/requirejs/require.js',
        'node_modules/three/three.min.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/q/q.js'];
    var destination = 'public_html/js/External';
    
    for (var i = 0; i< sources.length; i++) {
        console.log("Copying '" + sources[i] + "' to '" + destination + "'");
        gulp.src(sources[i]).pipe(gulp.dest(destination));
    }
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
