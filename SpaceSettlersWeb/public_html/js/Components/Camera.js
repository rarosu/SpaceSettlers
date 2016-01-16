/**
    Used for camera entities.
*/
define(function(require) {
    "use strict";
    
    var THREE = require('THREE');
    
    return {
        camera: null,
        radius: 50.0,
        azimuthal: Math.PI / 4,
        polar: Math.PI / 4,
        lookAt: new THREE.Vector3(0,0,0)
    };
});
