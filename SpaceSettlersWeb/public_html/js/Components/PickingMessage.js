define(function(require) {
    "use strict";
    
    var THREE = require('THREE');
    var PickingEvent = require('Components/PickingEvent');
    
    return {
        entity: null,
        pickingEvent: PickingEvent.NONE,
        intersectionPoint: new THREE.Vector3()
    };
});
