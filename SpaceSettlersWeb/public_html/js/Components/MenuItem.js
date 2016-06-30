define(function(require) {
    "use strict";
   
    var BuildTypeEnum = require('Components/BuildTypeEnum');
    var BuildStateEnum = require('Components/BuildStateEnum'); 
    return {
        buildState: BuildStateEnum.ROAD, 
        type: BuildTypeEnum.DIRT_ROAD, 
        icon: 'assets/icons/dirt-road-icon.png', 
        mesh: null,
        sideLength: 1.0
    };
});

