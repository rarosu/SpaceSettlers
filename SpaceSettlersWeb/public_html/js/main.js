requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'External/jquery-2.1.4.min',
        Simplex: 'External/simplex',
        THREE: 'External/three.min'
    },
    shim: {
        THREE: {
            exports: 'THREE'
        },
        Simplex: {
            exports: 'Simplex'
        }
    }
});

requirejs(['jquery', 'SpaceSettlers'], function($, SpaceSettlers) {
    $(document).ready(function() {
        var settlers = new SpaceSettlers();
    });
});
