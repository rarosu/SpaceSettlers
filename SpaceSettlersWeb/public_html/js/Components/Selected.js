define(function(require) {
    "use strict";
    var BuildTypeEnum = require('Components/BuildTypeEnum');
    var BuildStateEnum = require('Components/BuildStateEnum'); 
    return {
        sideLength: 1,        
        objectType: BuildTypeEnum.DIRT_ROAD, 
        buildState: BuildStateEnum.ROAD,
        mesh: null 
    };
});