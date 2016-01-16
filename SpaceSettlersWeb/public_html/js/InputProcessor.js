define(function(require) {
    "use strict";
    
    var clone = require('Clone');
    
    function InputProcessor(entityManager)
    {
        this.entityManager = entityManager;
        this.entityFilter = this.entityManager.createEntityFilter(['InputReceiver']);
        var _this = this; 

        document.addEventListener("keydown", function(e) {
            for (var entity = _this.entityFilter.first(); entity !== undefined; entity = _this.entityFilter.next())
            {
                var inputReceiver = _this.entityManager.getComponent(entity, 'InputReceiver');
                var index = inputReceiver.currentState.keyCodes.indexOf(e.keyCode);
                if (index < 0) {
                    inputReceiver.currentState.keyCodes.push(e.keyCode);               
                }
            }
        }); 

        document.addEventListener("keyup", function(e) {
            for (var entity = _this.entityFilter.first(); entity !== undefined; entity = _this.entityFilter.next())
            {
                var inputReceiver = _this.entityManager.getComponent(entity, 'InputReceiver');
                var index = inputReceiver.currentState.keyCodes.indexOf(e.keyCode);
                if (index >= 0) {
                    inputReceiver.currentState.keyCodes.splice(index, 1);             
                }
            }
        }); 

         document.addEventListener("mousemove", function(e) {       
            for (var entity = _this.entityFilter.first(); entity !== undefined; entity = _this.entityFilter.next())
            {
                var inputReceiver = _this.entityManager.getComponent(entity, 'InputReceiver');
                inputReceiver.currentState.mousePosition.x = e.clientX;
                inputReceiver.currentState.mousePosition.y = e.clientY;
            }
         }); 

         document.addEventListener("mousedown", function(e) {       
            for (var entity = _this.entityFilter.first(); entity !== undefined; entity = _this.entityFilter.next())
            {
                var inputReceiver = _this.entityManager.getComponent(entity, 'InputReceiver');
                if(e.which == 1)
                    inputReceiver.currentState.buttons.left = true;
                if(e.which == 3)
                    inputReceiver.currentState.buttons.right = true;
            }
         }); 

         document.addEventListener("mouseup", function(e) {       
            for (var entity = _this.entityFilter.first(); entity !== undefined; entity = _this.entityFilter.next())
            {
                var inputReceiver = _this.entityManager.getComponent(entity, 'InputReceiver');
                if(e.which == 1)
                    inputReceiver.currentState.buttons.left = false;
                if(e.which == 3)
                    inputReceiver.currentState.buttons.right = false;
            }
         }); 

        document.addEventListener("wheel", function(e) {
            for (var entity = _this.entityFilter.first(); entity !== undefined; entity = _this.entityFilter.next())
            {
                var inputReceiver = _this.entityManager.getComponent(entity, 'InputReceiver');        
                inputReceiver.currentState.wheel.wheelY = e.deltaY;
            }
        }); 
    }

    InputProcessor.prototype.update = function()
    {
        for (var entity = this.entityFilter.first(); entity !== undefined; entity = this.entityFilter.next())
        {
            var inputReceiver = this.entityManager.getComponent(entity, 'InputReceiver');
            inputReceiver.currentState.wheel.wheelY = 0; 
            inputReceiver.previousState = clone(inputReceiver.currentState);
        }
    }
    
    return InputProcessor;
});


