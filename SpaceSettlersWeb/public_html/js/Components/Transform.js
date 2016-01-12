/**
    Used for every entity that has a physical location in the world.
*/
define(function(require) {
    "use strict";
    
    var THREE = require('THREE');
    
    return {
        position: new THREE.Vector3(),
        orientation: new THREE.Quaternion()
    };
});