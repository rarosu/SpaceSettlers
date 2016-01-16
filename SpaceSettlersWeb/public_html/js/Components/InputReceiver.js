define(function(require) {
    "use strict";
    
    var THREE = require('THREE');
    
    function InputState()
    {
        this.mousePosition = new THREE.Vector2();
        this.buttons = {
            left: false,
            right: false
        };

        this.keyCodes = new Array();
        this.wheel =
        {
            wheelY : 0
        }; 
    }
    
    return {
        currentState: new InputState(),
        previousState: new InputState()
    };
});
