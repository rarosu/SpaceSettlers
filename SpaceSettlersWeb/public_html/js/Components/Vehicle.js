/**
    Used for vehicle entities.
*/
define(function(require) {
    "use strict";
    
    var VehicleState = require('Components/VehicleState');
    
    return {
        acceleration: 0,
        speed: 0.1,
        orders: [],
        currentOrder: 0,
        state: VehicleState.Running
    };
});
